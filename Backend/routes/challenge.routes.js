import express from 'express';
import { getActiveChallenges, toggleChallengeParticipation } from '../controllers/challenge.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import {
  getChallengeProgress,
  toggleDayProgress,
  updateNumericProgress,
  getSharedRecipes,
  shareRecipeToPool,
  saveCommunityRecipe,
  getMySavedRecipes
} from '../controllers/challenge.controller.js';

const challengeRouter = express.Router();

// Get all active challenges along with user participation flags
challengeRouter.get('/active', isAuth, getActiveChallenges);

// Toggle state: Join or Leave Challenge
challengeRouter.post('/toggle/:id', isAuth, toggleChallengeParticipation);

// Sugar Challenge Progress Tracking
challengeRouter.get('/progress/:challengeId', isAuth, getChallengeProgress);
challengeRouter.post('/progress/:challengeId/toggle-day', isAuth, toggleDayProgress);

// 3-litre Challenge Progress Tracking
challengeRouter.post('/progress/:challengeId/update-value', isAuth, updateNumericProgress);


// 👥 COMMUNITY REGIONAL RECIPE SWAP CHALLENGE

// 🟢 STEP 1: Personal bookmark shelf actions (Static paths must be on TOP)
challengeRouter.get('/recipes/saved', isAuth, getMySavedRecipes);
challengeRouter.post('/recipes/save/:recipeId', isAuth, saveCommunityRecipe);

// 🔵 STEP 2: Public pool actions (Dynamic wildcards go below static paths)
challengeRouter.get('/recipes/:challengeId', isAuth, getSharedRecipes);
challengeRouter.post('/recipes/:challengeId/share', isAuth, shareRecipeToPool);


export default challengeRouter;