
import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { getCurrentUser, completeProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();


userRouter.get('/currentuser', isAuth, getCurrentUser);

userRouter.post('/complete-profile', isAuth, completeProfile);


export default userRouter;