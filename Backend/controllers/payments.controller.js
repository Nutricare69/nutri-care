import createRazorpayInstance from '../config/razorpay.config.js';
import Order from '../models/PaymentModel/order.model.js';
import Plan from '../models/PaymentModel/plan.model.js';
import User from '../models/user.model.js';
import NutriPoints from '../models/Points/nutriPoints.model.js';
import { calculatePointsDiscount } from './nutriPoints.controller.js';
import crypto from 'crypto';

const razorpayInstance = createRazorpayInstance();

export const createOrder = async (req, res) => {
  try {
    const planId = req.body.planId;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    let finalPrice = plan.price;
    let pointsDeducted = 0;

    // Look up the user's wallet points to check for available discounts
    const wallet = await NutriPoints.findOne({ userId: req.user._id });
    if (wallet && wallet.totalPoints > 0) {
      const pointValueDiscount = calculatePointsDiscount(wallet.totalPoints);

      // Enforce the 50% max discount cap rule
      const maxAllowedDiscount = Math.round(plan.price * 0.50);
      const appliedDiscount = Math.min(pointValueDiscount, maxAllowedDiscount);

      finalPrice = plan.price - appliedDiscount;
      pointsDeducted = wallet.totalPoints;
    }

    const options = {
      amount: finalPrice * 100, // Amount in paise
      currency: plan.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        planId: planId,
        pointsToConsume: pointsDeducted.toString() // Tracks points to consume upon payment confirmation
      }
    };

    const order = await razorpayInstance.orders.create(options);

    await Order.create({
      orderId: order.id,
      planId: planId,
      userId: req.user._id,
      amount: order.amount,
      currency: order.currency,
      status: 'PENDING'
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      discountApplied: plan.price - finalPrice,
      pointsSpent: pointsDeducted,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error("Order Creation Failed:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature. Transaction tampered!" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'SUCCESS' },
      { returnDocument: 'after' }
    );

    if (!order) return res.status(404).json({ message: "Order records mismatch!" });

    // Fetch order details from Razorpay to read our points tracking notes safely
    const razorpayOrderDetails = await razorpayInstance.orders.fetch(razorpay_order_id);
    const pointsSpent = parseInt(razorpayOrderDetails.notes?.pointsToConsume || "0");

    if (pointsSpent > 0) {
      // Clear the user's wallet balance once the discount points are consumed
      await NutriPoints.findOneAndUpdate(
        { userId: order.userId },
        { $set: { totalPoints: 0 } }
      );
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await User.findByIdAndUpdate(order.userId, {
      isPremium: true,
      premiumValidUntil: expiryDate
    });

    return res.status(200).json({ success: true, message: "Payment verified, premium unlocked!" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};