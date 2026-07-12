import mongoose from 'mongoose';

const nutriPointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  // Keeps track of which challenges have already paid out points
  claimedChallenges: [{
    challengeId: {
      type: String,
      required: true
    },
    claimedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

export default mongoose.model('NutriPoints', nutriPointsSchema);