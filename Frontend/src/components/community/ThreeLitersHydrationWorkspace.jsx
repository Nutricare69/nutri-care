import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Trophy, Award, Sparkles } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext } from "../../context/UserContext"; // 🟢 IMPORTED: Access global points layer

export default function ThreeLitersHydrationWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const { triggerPointAwardEffect } = useContext(userDataContext); // 🟢 CONSUMED: Animation effect trigger
  const [waterLogged, setWaterLogged] = useState(0.0);
  const [loading, setLoading] = useState(true);

  const targetGoal = 3.0; // 3.0 Liters baseline threshold

  // Calculate dynamic progress bars and celebration triggers safely
  const personalPercentage = Math.min(
    Math.round((waterLogged / targetGoal) * 100),
    100,
  );
  const isTargetAchieved = waterLogged >= targetGoal;

  // 1. Fetch saved intake history on mount
  useEffect(() => {
    const fetchHydrationHistory = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/challenges/progress/${challenge._id}`,
          { withCredentials: true },
        );
        setWaterLogged(response.data.numericValue || 0.0);
      } catch (error) {
        console.error("Could not load database hydration tracking log:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHydrationHistory();
  }, [challenge._id, serverUrl]);

  // 2. Commit log adjustments dynamically down to MongoDB
  const handleLogWater = async (amount) => {
    // Optimistic UI Update: calculate new value instantly for fluid speed performance
    const newValue = parseFloat((waterLogged + amount).toFixed(2));
    setWaterLogged(newValue);

    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/progress/${challenge._id}/update-value`,
        { value: newValue },
        { withCredentials: true },
      );

      const confirmedValue = response.data.numericValue || 0.0;
      setWaterLogged(confirmedValue);

      // 🟢 NEW: Trigger point award claims matching the exact moment they cross the 3.0L line
      if (confirmedValue >= targetGoal) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 150 },
            { withCredentials: true },
          );

          // Smooth 600ms delayed rollout animation
          setTimeout(() => {
            triggerPointAwardEffect(150);
          }, 600);
        } catch (claimError) {
          console.log(
            "Points for this hydration milestone have already been secured today.",
          );
        }
      }
    } catch (error) {
      console.error("Failed to sync water volume logs:", error);
      alert("Network logging failed. Reverting intake progress entries.");
      // Rollback optimistic state on failure
      setWaterLogged(waterLogged);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-wider">
          Loading Hydration Sync Profiles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Real-time Individual Intake Progress Card */}
      <div className="bg-gray-50 dark:bg-zinc-900/40 border dark:border-zinc-800/60 p-5 rounded-2xl space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-blue-500" /> Your Fluid Balance Log
          </span>
          <span className="text-blue-500 font-black">
            {waterLogged}L / {targetGoal}L Completed
          </span>
        </div>

        {/* Animated Bar Track Shell */}
        <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${personalPercentage}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
          />
        </div>
        <p className="text-[11px] text-gray-400 text-right font-medium">
          Daily goal is {personalPercentage}% achieved
        </p>
      </div>

      {/* Target Achieved Celebration Banner */}
      <AnimatePresence>
        {isTargetAchieved && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 border-2 border-dashed border-blue-400 dark:border-blue-600/40 rounded-2xl text-center max-w-md mx-auto relative"
          >
            <Sparkles className="absolute top-2 left-2 text-blue-400 w-4 h-4 animate-ping" />
            <Award className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <h6 className="font-bold text-gray-800 dark:text-blue-400 text-base">
              💧 Cellular Target Hit!
            </h6>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Fantastic work! You successfully hit your 3.0-liter baseline mark
              for the day. Your cognitive systems and metabolic processes are
              running at full power.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Status Circle Display Container */}
      <div className="text-center space-y-4">
        <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center border-4 border-blue-500/20 rounded-full">
          <Droplet className="w-20 h-20 text-blue-500/10 absolute inset-0 m-auto animate-pulse" />
          <span className="text-3xl font-black text-blue-500 relative z-10">
            {waterLogged}L
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 relative z-10">
            Total Intake
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Interactive Logging Button Triggers */}
      <div className="flex gap-3 justify-center max-w-sm mx-auto">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleLogWater(0.25)}
          className="flex-1 px-4 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-colors"
        >
          + 250ml Glass
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleLogWater(0.75)}
          className="flex-1 px-4 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-bold text-sm border border-transparent dark:border-zinc-700 cursor-pointer transition-colors"
        >
          + 750ml Bottle
        </motion.button>
      </div>
    </div>
  );
}
