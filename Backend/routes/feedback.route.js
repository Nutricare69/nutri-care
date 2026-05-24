import express from 'express';
import {submitFeedback} from '../controllers/feedback.controller.js';

const feedbackRouter =express.Router();

feedbackRouter.get('/feedback', (req,res)=>{
  res.send('Feedback endpoint is working');
});

feedbackRouter.post('/feedback',submitFeedback);



export default feedbackRouter;