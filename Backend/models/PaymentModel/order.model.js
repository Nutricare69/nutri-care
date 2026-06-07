import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId , ref: 'User'},
  planId: {type:mongoose.Schema.Types.ObjectId , ref: 'Plan'},
  orderId: {type: String, required: true},
  amount:{type: Number , required:true},
  status:{type:String,enum: ['PENDING','SUCCESS','FAILED'], default:'PENDING'}
}, {timestamps:true});

const Order = mongoose.model('Order', orderSchema);
export default Order;
