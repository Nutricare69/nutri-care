import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import feedbackRouter from './routes/feedback.route.js';
import nutriPlanRouter from './routes/nutritionPlan.route.js';
import paymentRouter from './routes/payment.routes.js';
import challengeRouter from './routes/challenge.routes.js';
import nutriPointsRouter from './routes/nutriPoints.routes.js';


import cookieParser from 'cookie-parser';
import cors from 'cors';


const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(
  corsOptions));

console.log("Allowed Origin is:", process.env.ALLOWED_ORIGIN);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running and responding to requests');
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/contact', feedbackRouter);
app.use('/api/generate', nutriPlanRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/challenges', challengeRouter);
app.use('/api/points', nutriPointsRouter);
app.listen(port, '0.0.0.0', () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
})


