import createRazorpayInstance from '../config/razorpay.config.js';
import Order from '../models/PaymentModel/order.model.js';
import Plan from '../models/PaymentModel/plan.model.js';
import User from '../models/user.model.js';
import crypto from 'crypto'; // Built-in Node.js module to verify signatures

const razorpayInstance = createRazorpayInstance();

// Fix 1: Use standard ES Module export format matching your imports
export const createOrder = async (req, res) => {
  try {
    const planId = req.body.planId;

    // 1. Fetch plan details from database
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // 2. Prepare Razorpay options
    // NOTE: If plan.price is already in paise (e.g. 49900), remove the "* 100"
    const options = {
      amount: plan.price * 100,
      currency: plan.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(), // Crucial: Link user ID to tracking metadata
        planId: planId
      }
    };

    //  2: Use async/await for Razorpay order instead of an inline callback block
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to initiate order with Razorpay' });
    }

    // Fix 3: Save order to your database with a 'PENDING' or 'CREATED' status
    await Order.create({
      orderId: order.id,
      planId: planId,
      userId: req.user._id,
      amount: order.amount,
      currency: order.currency,
      status: 'PENDING' // Never mark 'SUCCESS' until the payment verification passes later!
    });

    // 4. Return the order details to frontend to launch checkout wizard
    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error("Razorpay Order Error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Verify the payment signature to ensure it's authentic
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature. Transaction tampered!" });
    }

    // 2. Update the Order status in your database
    const order = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: 'SUCCESS' },
      { returnDocument: 'after' } // returns the updated order document
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // 3. Update User Model
    // Calculate the 30-day expiry window
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Give this specific user unlimited access for the next month
    await User.findByIdAndUpdate(order.userId, {
      isPremium: true,
      premiumValidUntil: expiryDate // Changed to match your nutrition controller
    });

    return res.status(200).json({ success: true, message: "Payment verified, premium unlocked!" });

  } catch (err) {
    console.error("Payment Verification Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

