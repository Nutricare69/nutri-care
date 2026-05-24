import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    },
  },

    category:{
      type:String,
      required:true,
      enum: ["login-issue",
        "response-error",
        "wrong-diet-plan",
        "other"]
    },
    
    description:{
      type:String,
      required:true,
    },
  }, { timestamps: true })

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;