import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Check, Waves, Award } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext } from "../../context/UserContext.jsx";

export default function PreMealWaterWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const [completedLogs, setCompletedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { triggerPointAwardEffect } = useContext(userDataContext);

  // 🟢 FIXED: Check for numerical IDs instead of strings to satisfy Mongoose array types
  const lunchLogged = completedLogs.includes(1);
  const dinnerLogged = completedLogs.includes(2);

  // Calculate current volume configuration metrics based on numerical positions
  const currentVolume = (lunchLogged ? 500 : 0) + (dinnerLogged ? 500 : 0);
  const totalTargetVolume = 1000;
  const currentPercentage = Math.min(
    Math.round((currentVolume / totalTargetVolume) * 100),
    100,
  );

  // 1. Fetch saved hydration entries from the database on mount
  useEffect(() => {
    const fetchWaterProgress = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/challenges/progress/${challenge._id}`,
          { withCredentials: true },
        );
        setCompletedLogs(response.data.completedDays || []);
      } catch (error) {
        console.error(
          "Could not sync water tracking arrays from server:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWaterProgress();
  }, [challenge._id, serverUrl]);

  // 2. Commit checkbox toggle logs with stable numerical parameters
  const handleToggleLog = async (mealId) => {
    const isCurrentlyLogged = completedLogs.includes(mealId);
    const backupLogs = [...completedLogs];

    // Snappy local state mutation (Optimistic UI)
    if (isCurrentlyLogged) {
      setCompletedLogs((prev) => prev.filter((item) => item !== mealId));
    } else {
      setCompletedLogs((prev) => [...prev, mealId]);
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/progress/${challenge._id}/toggle-day`,
        { day: mealId }, // 🟢 FIXED: Sends an integer (1 or 2) which casts beautifully inside MongoDB
        { withCredentials: true },
      );
      setCompletedLogs(response.data.completedDays || []);

      const checkLunch = response.data.completedDays.includes(1);
      const checkDinner = response.data.completedDays.includes(2);
      if (checkLunch && checkDinner) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 50 },
            { withCredentials: true },
          );
          setTimeout(() => {
            triggerPointAwardEffect(50);
          }, 600); // Delay to ensure state updates before animation
        } catch (err) {
          console.log("Points already claimed previously.");
        }
      }
    } catch (error) {
      console.error("Hydration server post failed:", error);
      setCompletedLogs(backupLogs); // Rollback instantly to stable state if request drops
      alert("Hydration connection dropped. Reverting change.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-wider">
          Loading Hydration Monitors...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-4 space-y-6 max-w-md mx-auto">
      {/* Dynamic Fluid Fill Tracking Indicator */}
      <div className="bg-blue-500/5 border border-blue-100 dark:border-blue-950/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-md shrink-0 relative overflow-hidden">
            <Waves className="w-5 h-5 relative z-10 animate-pulse" />
          </div>
          <div>
            <h6 className="text-sm font-bold text-gray-800 dark:text-zinc-200">
              Pre-Meal Status
            </h6>
            <p className="text-xs text-gray-400 font-medium">
              Logged: {currentVolume}ml / {totalTargetVolume}ml
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-blue-500">
            {currentPercentage}%
          </span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Fulfilled
          </p>
        </div>
      </div>

      {/* Interactive Water Bubble Toggle Buttons Row */}
      <div className="flex justify-center gap-8 pt-2">
        {/* Lunch Tracking Bubble */}
        <div className="flex flex-col items-center gap-2.5 group">
          <button
            type="button"
            onClick={() => handleToggleLog(1)} // 🟢 Passes integer 1
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
              lunchLogged
                ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10"
                : "bg-gray-50 dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 text-gray-400 hover:border-blue-300 dark:hover:border-zinc-700 cursor-pointer"
            }`}
          >
            {lunchLogged ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">
                  500ml
                </span>
              </motion.div>
            ) : (
              <Droplet className="w-7 h-7 group-hover:scale-110 transition-transform group-hover:text-blue-400" />
            )}
          </button>
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 tracking-wide">
            30m Before Lunch
          </span>
        </div>

        {/* Dinner Tracking Bubble */}
        <div className="flex flex-col items-center gap-2.5 group">
          <button
            type="button"
            onClick={() => handleToggleLog(2)} // 🟢 Passes integer 2
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
              dinnerLogged
                ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10"
                : "bg-gray-50 dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 text-gray-400 hover:border-blue-300 dark:hover:border-zinc-700 cursor-pointer"
            }`}
          >
            {dinnerLogged ? (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">
                  500ml
                </span>
              </motion.div>
            ) : (
              <Droplet className="w-7 h-7 group-hover:scale-110 transition-transform group-hover:text-blue-400" />
            )}
          </button>
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 tracking-wide">
            30m Before Dinner
          </span>
        </div>
      </div>

      {/* Informational Core Descriptions */}
      <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed px-2">
        {challenge.description}
      </p>

      {/* Target Achievement Celebratory Card Box */}
      <AnimatePresence>
        {currentPercentage === 100 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white shadow-md flex items-center gap-3 text-left"
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h7 className="block text-xs font-black uppercase tracking-wider">
                Hydration Blueprint Locked
              </h7>
              <p className="text-[11px] text-blue-100 mt-0.5 leading-relaxed">
                Fantastic execution! Drinking 500ml before major meals stretches
                your stomach receptors to curb false appetite triggers and
                signals your digestive enzymes to mobilize efficiently.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl text-xs font-bold text-blue-600 dark:text-blue-400 max-w-xs mx-auto border border-blue-100/40 dark:border-blue-900/10">
            Daily Target: {challenge.targetValue} (500ml each)
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
