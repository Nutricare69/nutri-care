import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fats: {
        type: Number,
        required: true,
    },
    food_preference: {
        type: [String],
        default: [],
        enum: ['vegetarian', 'vegan', 'non_vegetarian', 'eggetarian']
    },
    allergens: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

export default Food;
