/**
 * Calculates rolling 30-day quota windows for free tier users
 * @param {String|Date} lastMealPlanDate - Timestamp of the user's latest generation
 * @returns {Object} quotaStatus metrics
 */
export const calculateQuotaStatus = (lastMealPlanDate) => {
  if (!lastMealPlanDate) {
    return { isLimitActive: false, remainingDays: 0, nextRenewalDate: null };
  }

  const now = new Date();
  const lastGenerated = new Date(lastMealPlanDate);

  // Expiry target lock: Generation Date + 30 Days
  const nextRenewalDate = new Date(lastGenerated.getTime() + 30 * 24 * 60 * 60 * 1000);
  const diffTime = nextRenewalDate - now;

  // Calculate precise day offsets remaining
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If time has run out, the window is officially cleared
  if (diffTime <= 0) {
    return {
      isLimitActive: false,
      remainingDays: 0,
      nextRenewalDate: null,
      shouldNotifyRenewal: true
    };
  }

  return {
    isLimitActive: true,
    remainingDays,
    nextRenewalDate,
    shouldNotifyRenewal: false
  };
};