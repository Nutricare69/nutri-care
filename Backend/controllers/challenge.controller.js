import Challenge from '../models/challenge.model.js';
import UserChallengeProgress from '../models/Community/userProgress.model.js';
// @desc    Get all active challenges along with user participation flags
// @route   GET /api/challenges/active
import SharedRecipe from '../models/Community/sharedRecipe.model.js';
import SavedRecipe from '../models/Community/savedRecipe.model.js';



export const getActiveChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();

    // Format response to include a custom joined boolean flag tailored to the requesting user
    const formattedChallenges = challenges.map(ch => ({
      _id: ch._id,
      title: ch.title,
      description: ch.description,
      category: ch.category,
      targetValue: ch.targetValue,
      totalTargetGoal: ch.totalTargetGoal,
      participantsCount: ch.participants.length,
      hasJoined: ch.participants.includes(req.user._id)
    }));

    return res.status(200).json(formattedChallenges);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle state: Join or Leave Challenge
// @route   POST /api/challenges/toggle/:id
export const toggleChallengeParticipation = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const userIndex = challenge.participants.indexOf(req.user._id);
    let joined = false;

    if (userIndex === -1) {
      challenge.participants.push(req.user._id); // Join
      joined = true;
    } else {
      challenge.participants.splice(userIndex, 1); // Leave
    }

    await challenge.save();
    return res.status(200).json({
      message: joined ? "Joined successfully" : "Left successfully",
      participantsCount: challenge.participants.length,
      hasJoined: joined
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/************************************************** */

//*******Sugar Challenge Progress Tracking //****** 
// @desc    Get progress tracking array for a specific joined challenge
// @route   GET /api/challenges/progress/:challengeId
export const getChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;

    // Find existing log, or initialize an empty baseline node if it's their first time opening it
    let progress = await UserChallengeProgress.findOne({ user: req.user._id, challenge: challengeId });
    if (!progress) {
      progress = await UserChallengeProgress.create({ user: req.user._id, challenge: challengeId, completedDays: [] });
    }

    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle a specific day inside the progress tracking array
// @route   POST /api/challenges/progress/:challengeId/toggle-day
export const toggleDayProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { day } = req.body; // Expects an integer, e.g., 3

    let progress = await UserChallengeProgress.findOne({ user: req.user._id, challenge: challengeId });
    if (!progress) {
      progress = await UserChallengeProgress.create({ user: req.user._id, challenge: challengeId, completedDays: [] });
    }

    const dayIndex = progress.completedDays.indexOf(day);
    if (dayIndex === -1) {
      progress.completedDays.push(day); // Day wasn't there -> Check off
    } else {
      progress.completedDays.splice(dayIndex, 1); // Day was there -> Uncheck
    }

    await progress.save();
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/************************************************** */

/****  3litre hydration workspace ******* */


// @desc    Update numeric value for volume or counter-based challenges
// @route   POST /api/challenges/progress/:challengeId/update-value
export const updateNumericProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { value } = req.body; // Expects a number, e.g., 1.25

    let progress = await UserChallengeProgress.findOne({ user: req.user._id, challenge: challengeId });
    if (!progress) {
      progress = await UserChallengeProgress.create({ user: req.user._id, challenge: challengeId, completedDays: [], numericValue: 0 });
    }

    progress.numericValue = value;
    await progress.save();

    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/************************************************** */

//regional vegetarian swap challenge progress tracking


// 1. Get all public shared recipes for this specific challenge
export const getSharedRecipes = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const recipes = await SharedRecipe.find({ challenge: challengeId }).sort({ createdAt: -1 });
    return res.status(200).json(recipes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 2. Post a recipe out of your personal AI plan into the public pool
export const shareRecipeToPool = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { name, region, state, macros } = req.body;

    // Safely format the user's name as "Firstname L."
    const firstInitial = req.user.name ? req.user.name.split(" ")[0] : "User";
    const lastInitial = req.user.name && req.user.name.split(" ")[1] ? req.user.name.split(" ")[1][0] + "." : "";
    const formattedCreatorName = `${firstInitial} ${lastInitial}`;

    const newRecipe = await SharedRecipe.create({
      challenge: challengeId,
      user: req.user._id,
      creatorName: formattedCreatorName,
      name, region, state, macros
    });
    return res.status(201).json(newRecipe);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 3. Bookmark someone else's shared recipe card
export const saveCommunityRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const alreadySaved = await SavedRecipe.findOne({ user: req.user._id, recipe: recipeId });
    if (alreadySaved) {
      return res.status(400).json({ message: "Recipe is already saved to your shelf" });
    }

    await SavedRecipe.create({ user: req.user._id, recipe: recipeId });
    return res.status(201).json({ message: "Recipe bookmarked successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 4. Get all bookmarked recipes for the logged-in user
export const getMySavedRecipes = async (req, res) => {
  try {
    // Look up saved references and auto-populate the full recipe content using its ID reference
    const savedCards = await SavedRecipe.find({ user: req.user._id }).populate('recipe');
    const cleanRecipes = savedCards.map(item => item.recipe).filter(r => r !== null);
    return res.status(200).json(cleanRecipes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};