import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Heart, Trophy } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext} from "../../context/UserContext.jsx";


export default function MindfulEatingWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const [loggedMeals, setLoggedMeals] = useState(0);
  const [loading, setLoading] = useState(true);

  const maxMealsTarget = 10;
  const currentPercentage = Math.min(
    Math.round((loggedMeals / maxMealsTarget) * 100),
    100,
  );
  const isChallengeComplete = loggedMeals >= maxMealsTarget;

const { triggerPointAwardEffect } = useContext(userDataContext);

  // 1. Fetch saved numeric log count from the backend database on open
  useEffect(() => {
    const fetchMindfulProgress = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/challenges/progress/${challenge._id}`,
          { withCredentials: true },
        );
        // Map saved numericValue directly to state, defaulting to 0 for fresh trackers
        setLoggedMeals(response.data.numericValue || 0);
      } catch (error) {
        console.error(
          "Could not load mindful tracking counter from database:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMindfulProgress();
  }, [challenge._id, serverUrl]);

  // 2. Increment value with snappy optimistic state fallback logic
  const handleLogMeal = async () => {
    if (loggedMeals >= maxMealsTarget) return;

    const nextCountValue = loggedMeals + 1;
    const backupValue = loggedMeals;

    // Optimistic UI change: updates instantly on click before server returns
    setLoggedMeals(nextCountValue);

    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/progress/${challenge._id}/update-value`,
        { value: nextCountValue }, // Sends the updated number count to progress.numericValue
        { withCredentials: true },
      );
      setLoggedMeals(response.data.numericValue || 0);

      //coins award logic add  to wallet

      if (response.data.numericValue >= maxMealsTarget) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 150 },
            { withCredentials: true },
          );
          setTimeout(() => {
            triggerPointAwardEffect(150);
          }, 600);
        } catch (err) {
          console.log("Points already claimed previously.");
        }
      }
    } catch (error) {
      console.error("Failed to sync mindful meal log entry to server:", error);
      setLoggedMeals(backupValue); // Revert to stable value if request fails
      alert("Meal logging dropped due to connection error. Reverting counter.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-wider">
          Syncing Mindful Logs...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center py-4 max-w-md mx-auto">
      {/* Dynamic Splash Badge Container */}
      <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-950/30 text-purple-500 rounded-2xl flex items-center justify-center relative shadow-inner">
        <Sparkles
          className={`w-10 h-10 ${loggedMeals > 0 ? "animate-pulse" : ""}`}
        />
        {isChallengeComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 p-1 bg-purple-600 text-white rounded-full border-2 border-white dark:border-zinc-900"
          >
            <Trophy className="w-3 h-3" />
          </motion.div>
        )}
      </div>

      {/* Progress Calculation Display Headers */}
      <div className="space-y-2">
        <h5 className="text-2xl font-black text-purple-500 tracking-tight">
          {loggedMeals} / {maxMealsTarget} Meals Complete
        </h5>

        {/* Customized Progress Bar Node Container */}
        <div className="w-full bg-gray-100 dark:bg-zinc-800/80 h-3 rounded-full overflow-hidden relative border dark:border-zinc-800/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentPercentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider px-0.5">
          <span>Pace: 20 min chew rhythm</span>
          <span>{currentPercentage}% Locked</span>
        </div>
      </div>

      {/* Core Informational Description Deck */}
      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed px-4">
        {challenge.description}
      </p>

      {/* Interactive Logging Execution Button Trigger */}
      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleLogMeal}
          disabled={isChallengeComplete}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500/20 disabled:text-purple-400/40 text-white font-bold text-sm shadow-md rounded-xl flex items-center gap-2 mx-auto transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          {isChallengeComplete ? "Goal Target Fulfilled" : "Log Mindful Meal"}
        </motion.button>
      </div>

      {/* Achievement Reward Notification Box */}
      <AnimatePresence>
        {isChallengeComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-3 text-left"
          >
            <div className="p-2 bg-purple-500 text-white rounded-xl shadow-xs mt-0.5">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h6 className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Neurological Blueprint Synced!
              </h6>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                Phenomenal routine control! Logging 10 meals while chewing
                intentionally resets your satiety signals, giving your brain
                enough time to recognize fullness and optimize nutrient
                processing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
