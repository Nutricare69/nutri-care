import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { generateNutriPlan, getAllPLans, getPlanById } from '../controllers/nutritionPlan.controller.js';

const nutriPlanRouter = express.Router();

nutriPlanRouter.post('/ml-response-generate', isAuth, generateNutriPlan);
nutriPlanRouter.get('/all-plans', isAuth, getAllPLans);
nutriPlanRouter.get('/plan/:id', isAuth, getPlanById);


export default nutriPlanRouter;