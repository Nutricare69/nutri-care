
import express from 'express';
import { isAuth, isAuthOptional } from '../middleware/auth.middleware.js';
import { getCurrentUser, completeProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();


userRouter.get('/currentuser', isAuthOptional, getCurrentUser);

userRouter.post('/complete-profile', isAuth, completeProfile);


export default userRouter;