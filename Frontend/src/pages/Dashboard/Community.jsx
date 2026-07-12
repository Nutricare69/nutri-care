import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplet,
  Flame,
  Users,
  Sparkles,
  Trophy,
  ArrowRight,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify"; 
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import { useTheme } from "../../components/theme.js";
import Loader from "../../components/Loader";

// Import the 6 Separate Modular Workspace Files
import SugarFreeWorkspace from "../../components/community/SugarFreeWorkspace";
import ThreeLitersHydrationWorkspace from "../../components/community/ThreeLitersHydrationWorkspace";
import RegionalCulinarySwap from "../../components/community/RegionalCulinarySwap.jsx";
import SodiumControlWorkspace from "../../components/community/SodiumControlWorkspace";
import PreMealWaterWorkspace from "../../components/community/PreMealWaterWorkspace";
import MindfulEatingWorkspace from "../../components/community/MindfulEatingWorkspace";

export default function Community() {
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { isDark } = useTheme();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/challenges/active`, {
        withCredentials: true,
      });
      setChallenges(response.data || []);
    } catch (error) {
      console.error("Error connecting to database endpoint:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleToggleChallenge = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/toggle/${id}`,
        {},
        { withCredentials: true },
      );

      // Find the specific challenge name to customize our success notifications
      const targetChallenge = challenges.find((ch) => ch._id === id);
      const challengeTitle = targetChallenge
        ? targetChallenge.title
        : "Challenge";

      setChallenges((prev) =>
        prev.map((ch) =>
          ch._id === id
            ? {
                ...ch,
                hasJoined: response.data.hasJoined,
                participantsCount: response.data.participantsCount,
              }
            : ch,
        ),
      );

      
      if (response.data.hasJoined) {
        toast.success(
          `Counted in! Welcome to the "${challengeTitle}" dashboard workspace.`,
        );
      } else {
        toast.info(
          `Successfully stepped down from the "${challengeTitle}" accountability tracker.`,
        );
      }

      if (activeWorkspace?._id === id && !response.data.hasJoined) {
        setActiveWorkspace(null);
      }
    } catch (error) {
      console.error("Could not trigger participation check toggles:", error);
      toast.error(
        "Network synchronization anomaly. Failed to update your participation record.",
      );
    }
  };

  const getCategoryMeta = (category) => {
    switch (category) {
      case "Hydration":
        return {
          icon: Droplet,
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/20",
        };
      case "Nutrition":
        return {
          icon: Flame,
          color: "text-orange-500",
          bg: "bg-orange-50 dark:bg-orange-950/20",
        };
      default:
        return {
          icon: Sparkles,
          color: "text-purple-500",
          bg: "bg-purple-50 dark:bg-purple-950/20",
        };
    }
  };

  const renderWorkspaceContent = (challenge) => {
    const title = challenge.title;
    if (title.includes("Sugar-Free"))
      return <SugarFreeWorkspace challenge={challenge} />;
    if (title.includes("3L Daily"))
      return <ThreeLitersHydrationWorkspace challenge={challenge} />;
    if (title.includes("Culinary Swap"))
      return <RegionalCulinarySwap challenge={challenge} />;
    if (title.includes("Sodium Control"))
      return <SodiumControlWorkspace challenge={challenge} />;
    if (title.includes("Pre-Meal Water"))
      return <PreMealWaterWorkspace challenge={challenge} />;
    if (title.includes("Mindful Eating"))
      return <MindfulEatingWorkspace challenge={challenge} />;

    return (
      <div className="text-center py-4">
        Workspace configuration processing...
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 w-full"
    >
      {/* Title Layout Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-green-500 rounded-full shrink-0" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            NutriCare Wellness Hub
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 pl-[18px]">
          Participate in live accountability trackers populated directly from
          our server records.
        </p>
      </div>

      {/* Conditionally switches between loader or card stack matrix */}
      {loading ? (
        <Loader inline />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {challenges.map((challenge) => {
            const meta = getCategoryMeta(challenge.category);
            const Icon = meta.icon;
            const currentPercentage = Math.min(
              Math.round(
                (challenge.participantsCount / challenge.totalTargetGoal) * 100,
              ),
              100,
            );

            return (
              <motion.div
                key={challenge._id}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-[#0c130d] rounded-3xl p-6 shadow-md border border-transparent dark:border-green-950/20 flex flex-col justify-between transition-colors duration-300"
                style={{
                  boxShadow: isDark
                    ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                    : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      {challenge.category}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />{" "}
                      {challenge.participantsCount} Active
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {challenge.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-zinc-400 px-1">
                      <span>Goal Progress</span>
                      <span>{currentPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentPercentage}%` }}
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {challenge.hasJoined && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveWorkspace(challenge)}
                        className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Open Action Workspace <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}

                    <button
                      onClick={(e) => handleToggleChallenge(challenge._id, e)}
                      className={`w-full py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        challenge.hasJoined
                          ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {challenge.hasJoined ? "Leave Challenge" : "Count Me In!"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Workspace Display Portal Overlay */}
      <AnimatePresence>
        {activeWorkspace && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-250 p-4"
            onClick={() => setActiveWorkspace(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c130d] rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-transparent dark:border-green-950/30"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-green-950/20 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                    Active Workspace
                  </span>
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5">
                    {activeWorkspace.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveWorkspace(null)}
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {renderWorkspaceContent(activeWorkspace)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
