import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { getUserWallet, claimChallengePoints } from '../controllers/nutriPoints.controller.js';

const nutriPointsRouter = express.Router();

nutriPointsRouter.get('/wallet', isAuth, getUserWallet);
nutriPointsRouter.post('/claim', isAuth, claimChallengePoints);

export default nutriPointsRouter;