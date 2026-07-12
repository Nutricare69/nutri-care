import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext } from "../../context/UserContext.jsx";

export default function SodiumControlWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const [completedDays, setCompletedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { triggerPointAwardEffect } = useContext(userDataContext);

  // Challenge metrics
  const totalDays = 5;
  const targetPercentage = Math.min(
    Math.round((completedDays.length / totalDays) * 100),
    100,
  );
  const isChallengePerfected = completedDays.length === totalDays;

  // 1. Fetch saved sodium log metrics from backend on mount
  useEffect(() => {
    const fetchSodiumProgress = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/challenges/progress/${challenge._id}`,
          { withCredentials: true },
        );
        // Sync state array with saved days, defaulting to empty array if record is fresh
        setCompletedDays(response.data.completedDays || []);
      } catch (error) {
        console.error(
          "Could not sync sodium checklists from server database:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSodiumProgress();
  }, [challenge._id, serverUrl]);

  // 2. Toggle item state dynamically using an optimistic local change first
  const toggleDay = async (day) => {
    // Optimistic UI Update: change state instantly for premium app responsiveness
    const isCurrentlyDone = completedDays.includes(day);
    const backupState = [...completedDays];

    if (isCurrentlyDone) {
      setCompletedDays((prev) => prev.filter((d) => d !== day));
    } else {
      setCompletedDays((prev) => [...prev, day]);
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/progress/${challenge._id}/toggle-day`,
        { day },
        { withCredentials: true },
      );
      // Double check database state payload confirmation matching alignment
      setCompletedDays(response.data.completedDays || []);
      if (response.data.completedDays?.length === 5) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 200 },
            { withCredentials: true },
          );
          setTimeout(() => {
            triggerPointAwardEffect(200);
          }, 600);
        } catch (err) {
          console.log("Points already claimed previously.");
        }
      }
    } catch (error) {
      console.error("Failed to commit day log to server backend:", error);
      // Rollback UI to previous stable node array state if database request drops
      setCompletedDays(backupState);
      alert("Network alignment failed. Reverting checkbox change entry logs.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold tracking-wider">
          Syncing Sodium Log Profiles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Real-time Tracking Performance Dashboard Module */}
      <div className="bg-gray-50 dark:bg-zinc-900/40 border dark:border-zinc-800/60 p-5 rounded-2xl space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Flame
              className={`w-4 h-4 transition-colors ${completedDays.length > 0 ? "text-amber-500 fill-amber-500/10" : "text-gray-400"}`}
            />
            Active Streak Focus
          </span>
          <span className="text-amber-600 dark:text-amber-400 font-black">
            {completedDays.length} / {totalDays} Days Done
          </span>
        </div>

        {/* Animated Custom Progress Bar */}
        <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${targetPercentage}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-[11px] text-gray-400 text-right font-semibold">
          Challenge checkpoint is {targetPercentage}% locked
        </p>
      </div>

      {/* Target Fulfill Alert Notification */}
      <AnimatePresence>
        {isChallengePerfected && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-dashed border-amber-500/40 rounded-2xl text-center max-w-md mx-auto flex flex-col items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-6 h-6 text-amber-500 animate-bounce" />
            <h6 className="font-bold text-sm text-gray-800 dark:text-amber-400">
              Cardiovascular Goal Clear!
            </h6>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Superb nutritional control! Keeping consecutive days under 2000mg
              balances your blood pressure and protects your cellular hydration
              boundaries perfectly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Context Deck */}
      <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center max-w-md mx-auto">
        <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h5 className="font-bold text-gray-800 dark:text-zinc-200">
          {challenge.title}
        </h5>
        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Interactive Logs Render Mapping */}
      <div className="space-y-2.5 max-w-md mx-auto">
        {[1, 2, 3, 4, 5].map((day) => {
          const isDone = completedDays.includes(day);
          return (
            <motion.div
              key={day}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleDay(day)}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                isDone
                  ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-bold shadow-xs"
                  : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-amber-300 dark:hover:border-zinc-700 text-gray-700 dark:text-zinc-300 font-medium"
              }`}
            >
              <span className="text-sm">Day {day}: Under 2000mg Sodium</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? "border-amber-500 bg-amber-500 shadow-xs"
                    : "border-gray-300 dark:border-zinc-700 bg-transparent"
                }`}
              >
                {isDone && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
