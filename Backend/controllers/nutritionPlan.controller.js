import axios from 'axios';
import NutriPlan from '../models/nutritionPlan.model.js';
import User from '../models/user.model.js';
import { calculateAge } from '../utils/calculateAge.js';

export const generateNutriPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const age = calculateAge(user.dateOfBirth);
 

    const profileData = {
      name:user.name,
      age: age,
      gender:req.body.gender,
      weight: req.body.weight,
      height: req.body.height,
      goal: req.body.goal,
      food_preference: req.body.food_preference,
      medical_conditions: req.body.medical_conditions || [],
      allergies: req.body.allergies || [],
      activity_level: req.body.activity_level,
      days: req.body.days,

    };
  

    const mlResponse = await axios.post("http://localhost:8000/api/meal-plan/generate", profileData);

    const mealPlan = mlResponse.data.meal_plan;
    const tdee = mlResponse.data.user_profile.tdee;
    const bmi = mlResponse.data.user_profile.bmi;
    const dailyTargets = mlResponse.data.daily_targets;

    const days = Object.entries(mealPlan).map(([day, meals], index) => {
      const formattedMeals = [
        {
          mealType: "Breakfast",
          foods: meals.Breakfast,
        },
        {
          mealType: "Lunch",
          foods: meals.Lunch,
        },
        {
          mealType: "Dinner",
          foods: meals.Dinner,
        },
      ];

      return {
        dayNumber: index + 1,
        meals: formattedMeals,
      };
    });

    const lastPlan = await NutriPlan.findOne({ user: userId }).sort({ createdAt: -1 });

    const nextPlanNumber = lastPlan ? lastPlan.planNumber + 1 : 1;

    const plan = new NutriPlan({
      user: userId,
      planNumber: nextPlanNumber,
      profileSnapshot: { ...profileData, tdee, bmi },
      daily_targets: dailyTargets,
      days: days,
    });

    await plan.save();
    res.status(201).json({ message: "Nutrition plan generated successfully", plan });
  } catch (error) {
    console.log("Error generating plan ", error);
    res.status(500).json({ message: "Failed to generate nutrition plan" });
  }
};

export const getAllPLans = async (req,res)=>{
  try{
    const userId = req.user._id;
    const plans = await NutriPlan.find({user:userId}).populate('user', ' userId name email').sort({createdAt:-1});
    res.status(200).json(plans);
  } catch(error){
    res.status(500).json({
      message:"Error fetching plans"
    });
  }
}

export const getPlanById = async (req,res)=>{
  try {
    const plan = await NutriPlan.findOne({_id:req.params.id, user:req.user._id});
    if(!plan){
      return res.status(404).json({message:"Plan not found"});
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({message:"Error fetching plan"});
  }
};