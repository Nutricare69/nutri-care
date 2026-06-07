import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type:Boolean,
    default: false
  },
  premiumValidUntil:{
    type:Date
  },
  // To track the 5 free meal plans per month
  freePlansUsedThisMonth:{
    type:Number,
    default:0
  },
  lastMealPlanDate: {
    type:Date
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;