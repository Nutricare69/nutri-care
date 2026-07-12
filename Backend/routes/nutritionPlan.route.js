import express from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { generateNutriPlan, getAllPLans, getPlanById,getLatestPlan } from '../controllers/nutritionPlan.controller.js';

const nutriPlanRouter = express.Router();

nutriPlanRouter.get('/latest', isAuth, getLatestPlan);
nutriPlanRouter.post('/ml-response-generate', isAuth, generateNutriPlan);
nutriPlanRouter.get('/all-plans', isAuth, getAllPLans);
nutriPlanRouter.get('/plan/:id', isAuth, getPlanById);
nutriPlanRouter.get('/:id', isAuth, getPlanById);

export default nutriPlanRouter;