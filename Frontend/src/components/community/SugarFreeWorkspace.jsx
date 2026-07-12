import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2, Trophy, Award, Sparkles } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext } from "../../context/UserContext.jsx";

export default function SugarFreeWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const [completedDays, setCompletedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { triggerPointAwardEffect } = useContext(userDataContext);

  const totalDays = 7; // Fixed baseline parameter for this specific challenge

  // Calculate personal completion metrics
  const totalCompleted = completedDays.length;
  const personalPercentage = Math.min(
    Math.round((totalCompleted / totalDays) * 100),
    100,
  );
  const isChallengeFullyComplete = totalCompleted === totalDays;

  useEffect(() => {
    const fetchProgressHistory = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/challenges/progress/${challenge._id}`,
          { withCredentials: true },
        );
        setCompletedDays(response.data.completedDays || []);
      } catch (error) {
        console.error("Could not fetch user database milestones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgressHistory();
  }, [challenge._id, serverUrl]);

  const toggleDay = async (day) => {
    try {
      // Optimistic UI Update
      setCompletedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
      );

      const response = await axios.post(
        `${serverUrl}/api/challenges/progress/${challenge._id}/toggle-day`,
        { day },
        { withCredentials: true },
      );

      setCompletedDays(response.data.completedDays || []);

      if (response.data.completedDays?.length === 7) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 250 },
            { withCredentials: true },
          );
          setTimeout(() => {
            triggerPointAwardEffect(250);
          }, 600); // Delay to ensure state updates before animation
        } catch (err) {
          console.log("Points already claimed previously.");
        }
      }
    } catch (error) {
      console.error("Failed to commit day check adjustment:", error);
      // Rollback optimistic update on network error
      setCompletedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-wider">
          Syncing Accountability Log...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* 🟢 NEW: DYNAMIC INDIVIDUAL STREAK TRACKER BAR */}
      <div className="bg-gray-50 dark:bg-zinc-900/40 border dark:border-zinc-800/60 p-5 rounded-2xl space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Your Personal Progress
          </span>
          <span className="text-orange-500">
            {totalCompleted} / {totalDays} Days Done
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${personalPercentage}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
          />
        </div>
        <p className="text-[11px] text-gray-400 text-right font-medium">
          Challenge is {personalPercentage}% complete
        </p>
      </div>

      {/* 🟢 NEW: CONGRATULATIONS BANNER ENGINES */}
      <AnimatePresence>
        {isChallengeFullyComplete && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 border-2 border-dashed border-amber-400 dark:border-amber-600/40 rounded-2xl text-center max-w-md mx-auto relative overflow-hidden"
          >
            <Sparkles className="absolute top-2 left-2 text-amber-400 w-4 h-4 animate-ping" />
            <Award className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
            <h6 className="font-bold text-gray-800 dark:text-amber-400 text-base">
              🏆 Challenge Mastered!
            </h6>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Incredible work! You completed all 7 days of the Sugar-Free
              blueprint. Your blood sugar levels and metabolic health profiles
              thank you.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Informational Hero Card */}
      <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 text-center max-w-md mx-auto">
        <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
        <h5 className="font-bold text-gray-800 dark:text-zinc-200 text-sm">
          {challenge.title}
        </h5>
        <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
          {challenge.description}
        </p>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2 max-w-md mx-auto">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const isDone = completedDays.includes(day);
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleDay(day)}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                isDone
                  ? "border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/40 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700"
              }`}
            >
              <span className="font-semibold text-sm">
                Day {day}: No Refined Sugar
              </span>
              <CheckCircle2
                className={`w-5 h-5 transition-colors ${isDone ? "text-orange-500" : "text-gray-300 dark:text-zinc-700"}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
