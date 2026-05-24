import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req,res) =>{
  try{
    const {name,email,phoneNumber, category, description} = req.body;

    const feedback = new Feedback({
      name,
      email, 
      phoneNumber, 
      category,
      description,
    })
    await feedback.save()
    res.status(201).json({message: "Feedback submitted successfully"});
  }catch(error){
    res.status(400).json({message: "Error submiting feedback", error:error.message})
  }
  }
