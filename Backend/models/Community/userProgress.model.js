import mongoose from 'mongoose';

const userChallengeProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  completedDays: [{ type: Number }], // Used for Sugar-Free & Sodium checklists or other day-based challenges
  numericValue: { type: Number, default: 0 } // 🟢 ADDED: Used for Hydration & Counter metrics
}, { timestamps: true });

userChallengeProgressSchema.index({ user: 1, challenge: 1 }, { unique: true });

const UserChallengeProgress = mongoose.model('UserChallengeProgress', userChallengeProgressSchema);
export default UserChallengeProgress;