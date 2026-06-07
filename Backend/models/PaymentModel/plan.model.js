import mongoose from "mongoose";

const planSchema =  new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
    price:{
      type:Number,
      required:true
    },
    currency:{
      type:String,
      default:'INR'
    },
    durationInDays:{
      type:Number,
      default:30
    }
});
const Plan = mongoose.model('Plan', planSchema);
export default Plan;