import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Plan from '../models/PaymentModel/plan.model.js';

// Resolve directory roots cleanly for local environmental configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedPlan = async () => {
  try {
    // 1. Connect to your database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // 2. Check if plan already exists
    const existingPlan = await Plan.findOne({ name: 'Premium' });
    if (existingPlan) {
      console.log(`Plan already exists! Use this ID in your frontend: ${existingPlan._id}`);
      process.exit();
    }

    // 3. Create the Premium Plan
    const premiumPlan = new Plan({
      name: 'Premium',
      price: 399, // Assuming your razorpay options multiplier (* 100) requires this to be rupees
      currency: 'INR',
      durationInDays: 30
    });

    // 4. Save to DB
    const savedPlan = await premiumPlan.save();
    console.log("Plan created successfully!");

    // THIS IS THE ID YOU NEED FOR YOUR FRONTEND!
    console.log(`\n--> IMPORTANT: Copy this ID to your frontend Pricing.jsx: ${savedPlan._id}\n`);

    process.exit();
  } catch (error) {
    console.error("Error seeding plan:", error);
    process.exit(1);
  }
};

seedPlan();