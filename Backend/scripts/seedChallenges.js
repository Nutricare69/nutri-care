import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Challenge from '../models/challenge.model.js';

// Resolve directory roots cleanly for local environmental configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 Explicitly force dotenv to step up one directory layer to find your main root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const challengesData = [
  {
    title: "7-Day Sugar-Free Challenge",
    description: "Eliminate all refined sugars from your meals this week to stabilize insulin levels and build fat-burning metabolic health.",
    category: "Nutrition",
    targetValue: "7 Days",
    totalTargetGoal: 300,
    participants: []
  },
  {
    title: "Hydration Streak: 3L Daily",
    description: "Keep your fluid balance optimal by hitting your 3-liter hydration targets daily to flush out cellular toxins.",
    category: "Hydration",
    targetValue: "3.0 Liters",
    totalTargetGoal: 500,
    participants: []
  },
  {
    title: "Regional Culinary Swap",
    description: "Share authentic regional recipes from your home state to crowdsource macro-balanced traditional dishes and celebrate dietary diversity.",
    category: "Nutrition", // 🟢 UPDATED: Automatically maps the Flame icon & orange badge in your UI!
    targetValue: "1 Recipe",
    totalTargetGoal: 200,
    participants: []
  },
  {
    title: "Sodium Control Sprint",
    description: "Limit sodium intake to under 2000mg a day to reduce fluid retention and normalize vascular pressure markers.",
    category: "Nutrition",
    targetValue: "5 Days",
    totalTargetGoal: 250,
    participants: []
  },
  {
    title: "Pre-Meal Water Blueprint",
    description: "Drink 500ml of pure water exactly 30 minutes before your main lunch and dinner windows to optimize digestive enzymes.",
    category: "Hydration",
    targetValue: "2 Daily",
    totalTargetGoal: 400,
    participants: []
  },
  {
    title: "The Mindful Eating Baseline",
    description: "Commit to chewing each bite 20+ times without looking at screens to optimize stomach vagus nerve signaling channels.",
    category: "Lifestyle",
    targetValue: "10 Meals",
    totalTargetGoal: 150,
    participants: []
  }
];

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB using environmental variables, fallback safely to standard port 27017
    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nutricare";
    await mongoose.connect(dbUri);
    console.log("⚡ Connected to MongoDB for seeding...");

    // 2. Smart seeding (Only add if the challenge title doesn't exist yet)
    for (const challenge of challengesData) {
      const exists = await Challenge.findOne({ title: challenge.title });
      if (!exists) {
        await Challenge.create(challenge);
        console.log(`✅ Seeded Challenge: "${challenge.title}"`);
      } else {
        console.log(`⏭️ Skipped (Already Exists): "${challenge.title}"`);
      }
    }

    console.log("\n🎉 Database challenge seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error.message);
    process.exit(1);
  }
};

seedDatabase();