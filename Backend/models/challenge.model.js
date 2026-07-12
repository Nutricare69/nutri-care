import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Hydration', 'Nutrition', 'Lifestyle'], required: true },
  targetValue: { type: String, required: true }, // e.g., "3 Liters", "7 Days"
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of joined users
  totalTargetGoal: { type: Number, default: 500 } // Community target milestone capacity
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;