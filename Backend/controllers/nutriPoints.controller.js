import NutriPoints from '../models/Points/nutriPoints.model.js';
import Plan from '../models/PaymentModel/plan.model.js';

// Calculate the discount value based on the user's current points
export const calculatePointsDiscount = (points) => {
  if (!points || points <= 0) return 0;

  let discountAmount = 0;
  if (points < 200) {
    discountAmount = points * 0.10;
  } else if (points >= 200 && points < 500) {
    discountAmount = points * 0.15;
  } else {
    discountAmount = points * 0.25;
  }
  return Math.round(discountAmount);
};

export const getUserWallet = async (req, res) => {
  try {
    let wallet = await NutriPoints.findOne({ userId: req.user._id });
    if (!wallet) {
      wallet = await NutriPoints.create({ userId: req.user._id, totalPoints: 0 });
    }
    return res.status(200).json(wallet);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const claimChallengePoints = async (req, res) => {
  try {
    const { challengeId, pointsToAward } = req.body;
    const userId = req.user._id;

    let wallet = await NutriPoints.findOne({ userId });
    if (!wallet) {
      wallet = await NutriPoints.create({ userId, totalPoints: 0 });
    }

    // Check if the points for this challenge have already been claimed
    const alreadyClaimed = wallet.claimedChallenges.some(
      (c) => c.challengeId === challengeId
    );

    if (alreadyClaimed) {
      return res.status(400).json({
        success: false,
        message: "Points for this event milestone have already been claimed."
      });
    }

    // Add points and log the completed challenge
    wallet.totalPoints += Number(pointsToAward);
    wallet.claimedChallenges.push({ challengeId });
    await wallet.save();

    return res.status(200).json({
      success: true,
      totalPoints: wallet.totalPoints,
      message: `Successfully earned +${pointsToAward} Nutri Points!`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};