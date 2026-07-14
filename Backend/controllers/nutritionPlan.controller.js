import axios from 'axios';
import NutriPlan from '../models/nutritionPlan.model.js';
import User from '../models/user.model.js';
import { calculateAge } from '../utils/calculateAge.js';

export const generateNutriPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    // OPTIMIZATION 1: Fetch user profile AND look up the last plan simultaneously
    const [user, lastPlan] = await Promise.all([
      User.findById(userId),
      NutriPlan.findOne({ user: userId }).sort({ createdAt: -1 })
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check access limits for free users
    if (!user.isPremium && user.freePlansUsedThisMonth >= 5) {
      return res.status(403).json({
        message: "You have used your 5 free meal plans this month. Please upgrade to Premium."
      });
    }

    const age = calculateAge(user.dateOfBirth);

    // FIXED: Capturing and packing regional fields into the FastAPI outgoing profileData block
    const profileData = {
      name: user.name,
      age: age,
      gender: req.body.gender,
      weight_kg: req.body.weight,
      height_cm: req.body.height,
      goal: req.body.goal,
      diet_preference: req.body.food_preference,
      region: req.body.region,  // ➔ Captured from client body request
      state: req.body.state,    // ➔ Captured from client body request
      medical_conditions: req.body.medical_conditions || [],
      allergies: req.body.allergies || [],
      activity_level: req.body.activity_level,
      plan_duration_days: req.body.days,
    };

    const PYTHONMODELURL = process.env.PYTHONMODELURL || "http://localhost:8000"; // Fallback to localhost for local dev
    // Hit your optimized Python FastAPI service
    const mlResponse = await axios.post(`${PYTHONMODELURL}/api/meal-plans/generate`, profileData);

    // Extract metric arrays directly from synchronized FastAPI response adapter
    const { days, user_profile, daily_targets } = mlResponse.data;

    // Calculate incremental generation sequence numbers
    const nextPlanNumber = lastPlan ? lastPlan.planNumber + 1 : 1;

    // COMPILE TRACKING OBJECT INSTANCE CONFORMING 100% TO YOUR MONGOOSE SCHEMA
    const plan = new NutriPlan({
      user: userId,
      planNumber: nextPlanNumber,  
      profileSnapshot: {
        age: profileData.age,
        weight: profileData.weight_kg,
        height: profileData.height_cm,
        gender: profileData.gender,
        goal: profileData.goal,
        food_preference: profileData.diet_preference,
        region: profileData.region, // ➔ Persisted inside MongoDB snapshot
        state: profileData.state,   // ➔ Persisted inside MongoDB snapshot
        medical_conditions: profileData.medical_conditions,
        allergies: profileData.allergies,
        activity_level: profileData.activity_level,
        bmi: user_profile.bmi,
        bmi_category: user_profile.bmi_category,    // ➔ Saves Python's computed BMI category string
        tdee: user_profile.tdee,
        days: profileData.plan_duration_days
      },
      daily_targets: daily_targets,
      days: days, // Directly injects clean, pre-mapped array data with Snacks included
    });

    // Prepare user document mutations locally
    if (!user.isPremium) {
      user.freePlansUsedThisMonth = (user.freePlansUsedThisMonth || 0) + 1;
    }
    user.lastMealPlanDate = new Date();

    // OPTIMIZATION 2: Save the new meal plan AND update user metadata at the same time in MongoDB
    await Promise.all([
      plan.save(),
      user.save()
    ]);

    // Send data straight back to your frontend
    res.status(201).json({ message: "Nutrition plan generated successfully", plan });
  } catch (error) {
    console.error("Error generating plan: ", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate nutrition plan" });
  }
};

export const getAllPLans = async (req, res) => {
  try {
    const userId = req.user._id;
    const plans = await NutriPlan.find({ user: userId }).populate('user', 'userId name email').sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans" });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await NutriPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plan" });
  }
};

//get plan by recently created plan

// @desc    Fetch the single most recent AI plan for the logged-in user
// @route   GET /api/dietplans/latest
export const getLatestPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    // Sorts by newest creation date first and grabs only the first document found
    const latestPlan = await NutriPlan.findOne({ user: userId })
      .sort({ createdAt: -1 });

    if (!latestPlan) {
      return res.status(404).json({ message: "No diet plans generated yet." });
    }

    return res.status(200).json(latestPlan);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching latest plan: " + error.message });
  }
};