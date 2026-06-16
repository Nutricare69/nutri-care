import mongoose from 'mongoose';

const nutriPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    planNumber: {
        type: Number,
        required: true,
    },

    profileSnapshot: {
        age: Number,
        weight: Number,
        height: Number,
        gender: String,
        goal: String,
        food_preference: String,
        medical_conditions: [String],
        allergies: [String],
        activity_level: String,
        bmi: Number,
        bmi_category: String,  // ➔ ADDED
        tdee: Number,
        days: Number,
        region: String,        // ➔ ADDED
        state: String,         // ➔ ADDED
    },

    daily_targets: {
        target_calories: Number,
        target_protein: Number,
        target_fat: Number,
        target_carbs: Number,
    },

    days: [
        {
            dayNumber: Number,
            meals: [
                {
                    mealType: {
                        type: String,
                        enum: ["Breakfast", "Lunch", "Dinner"],
                    },
                    foods: [
                        {
                            name: String,
                            calories: Number,
                            protein: Number,
                            fat: Number,
                            carbs: Number,
                        }
                    ],
                }
            ]
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const NutriPlan = mongoose.model('NutriPlan', nutriPlanSchema);

export default NutriPlan;