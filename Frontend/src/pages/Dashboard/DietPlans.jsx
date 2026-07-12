import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ChevronRight,
  Bookmark,
  Utensils,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";
import { useTheme } from "../../components/theme.js";
import AutoSelect from "../../components/AutoSelect.jsx";

export default function DietPlans() {
  // Consume our unified rolling quota metrics directly from global context
  const { userData, getCurrentUser, isQuotaCapped, remainingDays } =
    useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { isDark } = useTheme();

  // Modals Toggle States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);

  const [dietPlans, setDietPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [isOfflineView, setIsOfflineView] = useState(false); // 🟢 NEW: Component connection tracker

  // Community Bookmarks States
  const [savedCommunityMeals, setSavedCommunityMeals] = useState([]);

  // Form state for creating diet plan
  const [formData, setFormData] = useState({
    weight: "",
    feet: "",
    inches: "",
    goal: "Weight Loss",
    food_preference: "Veg",
    gender: "Male",
    days: 7,
    medical_conditions: "",
    allergies: "",
    activity_level: "Moderate",
    region: "West",
    state: "Maharashtra",
  });

  // Interceptor function checking the context flags when the button is clicked
  const handleOpenCreateModal = () => {
    // 🟢 NEW: Stop users from attempting complex ML generations while internet lines are broken
    if (!navigator.onLine) {
      toast.error(
        "Network connection down. AI Generation requires an active internet connection.",
      );
      return;
    }
    if (isQuotaCapped) {
      toast.error(
        `Quota exhausted! You have consumed your 5 free generations. Your slots will start renewing in ${remainingDays} days. Upgrade to Premium for infinite instant updates!`,
        { autoClose: 5000 },
      );
      return;
    }
    setShowCreateModal(true);
  };

  const calculateAgeFrontend = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const PlaystoreStar = ({ number }) => {
    return (
      <div className="relative w-14 h-14 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-green-500 rounded-xl transform rotate-45 opacity-80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-green-100 rounded-xl transform -rotate-45 opacity-80 mix-blend-multiply"></div>
          </div>
        </motion.div>

        <span className="relative z-5 text-white font-bold text-xs bg-black/35 w-10 h-10 flex flex-col items-center justify-center rounded-full backdrop-blur-sm">
          <span className="text-[9px] leading-none text-gray-200">Plan</span>
          <span className="leading-none">{number}</span>
        </span>
      </div>
    );
  };

  const userAge = calculateAgeFrontend(userData?.dateOfBirth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "days" && value === "14" && !userData?.isPremium) {
      toast.error(
        "14-Day strategy generation requires a Premium membership upgrade.",
      );
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    if (isQuotaCapped) {
      toast.error("Generation request rejected. Free tier limits exceeded.");
      return;
    }

    setLoading(true);

    const ft = parseFloat(formData.feet) || 0;
    const inc = parseFloat(formData.inches) || 0;
    const heightInCm = Math.round(ft * 30.48 + inc * 2.54);

    try {
      const user_profile = {
        weight: parseFloat(formData.weight),
        height: heightInCm,
        gender: formData.gender,
        goal: formData.goal,
        days: parseInt(formData.days),
        food_preference: formData.food_preference,
        region: formData.region,
        state: formData.state,
        medical_conditions: formData.medical_conditions
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        allergies: formData.allergies
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        activity_level: formData.activity_level,
      };

      await axios.post(
        `${serverUrl}/api/generate/ml-response-generate`,
        user_profile,
        { withCredentials: true },
      );

      toast.success("AI Diet Plan generated successfully!");
      setShowCreateModal(false);
      setFormData({
        weight: "",
        feet: "",
        inches: "",
        gender: "Male",
        goal: "Weight Loss",
        days: 7,
        food_preference: "Veg",
        medical_conditions: "",
        allergies: "",
        activity_level: "Moderate",
        region: "West",
        state: "Maharashtra",
      });
      await getCurrentUser();
      fetchDietPlans();
    } catch (error) {
      console.error("Error creating diet plan:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to compile your diet parameters. Please retry.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchDietPlans = async () => {
    // 🟢 NEW: Offline Interceptor Layer for Diet Plans array tracking
    if (!navigator.onLine) {
      const localPlans = localStorage.getItem("nutricare_cached_diet_plans");
      setDietPlans(localPlans ? JSON.parse(localPlans) : []);
      setIsOfflineView(true);
      setFetchingPlans(false);
      return;
    }

    try {
      const response = await axios.get(`${serverUrl}/api/generate/all-plans`, {
        withCredentials: true,
      });
      const dataPayload = response.data || [];
      setDietPlans(dataPayload);

      // Quietly write payload backings down into client cache lines
      localStorage.setItem(
        "nutricare_cached_diet_plans",
        JSON.stringify(dataPayload),
      );
      setIsOfflineView(false);
    } catch (error) {
      console.error("Error fetching diet plans, falling back to cache:", error);
      const localPlans = localStorage.getItem("nutricare_cached_diet_plans");
      setDietPlans(localPlans ? JSON.parse(localPlans) : []);
      setIsOfflineView(true);
    } finally {
      setFetchingPlans(false);
    }
  };

  const fetchSavedCommunityMeals = async () => {
    // 🟢 NEW: Offline Interceptor Layer for Bookmark Cookbooks
    if (!navigator.onLine) {
      const localBookmarks = localStorage.getItem(
        "nutricare_cached_saved_meals",
      );
      setSavedCommunityMeals(localBookmarks ? JSON.parse(localBookmarks) : []);
      return;
    }

    try {
      const response = await axios.get(
        `${serverUrl}/api/challenges/recipes/saved`,
        { withCredentials: true },
      );
      const dataPayload = response.data || [];
      setSavedCommunityMeals(dataPayload);
      localStorage.setItem(
        "nutricare_cached_saved_meals",
        JSON.stringify(dataPayload),
      );
    } catch (error) {
      console.error("Error fetching bookmarked recipes:", error);
      const localBookmarks = localStorage.getItem(
        "nutricare_cached_saved_meals",
      );
      setSavedCommunityMeals(localBookmarks ? JSON.parse(localBookmarks) : []);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      fetchDietPlans();
      fetchSavedCommunityMeals();
    }
  }, [serverUrl]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="dietplans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Main Workspace Header Content Layer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-green-500 rounded-full" />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Your AI Generated Diet Plans
              </h3>
            </div>

            {/* Action Buttons Top-Right Cluster Container */}
            <div className="flex items-center gap-3">
              {/* Bookmarks Toggle Trigger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  fetchSavedCommunityMeals();
                  setShowBookmarksModal(true);
                }}
                className="relative p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="View Saved Recipes"
              >
                <Bookmark className="w-5 h-5 fill-current text-green-500" />
                {savedCommunityMeals.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900">
                    {savedCommunityMeals.length}
                  </span>
                )}
              </motion.button>

              {/* Active Button calling handleOpenCreateModal directly */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors cursor-pointer"
                title="Generate Plan"
              >
                <Plus className="w-5 h-5" />
                Create New Plan
              </motion.button>
            </div>
          </div>

          {/* 🟢 NEW: Local Sub-Page Workspace Offline View Alert Banner */}
          {isOfflineView && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3.5"
            >
              <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Displaying last synced backup data records. New profile
                calibrations are restricted until internet access scales up.
              </div>
            </motion.div>
          )}

          {/* Context-Driven Cooldown Alert Banner */}
          {isQuotaCapped && !isOfflineView && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3.5"
            >
              <div className="p-2 bg-red-500 rounded-xl text-white shrink-0 shadow-sm">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-red-700 dark:text-red-400">
                <span className="font-black uppercase tracking-wider text-xs bg-red-500 text-white px-2 py-0.5 rounded-md mr-2">
                  Quota Spent
                </span>
                You have used 5/5 generations for this cycle. Your free plan
                quota resets in{" "}
                <span className="font-black text-gray-900 dark:text-white underline">
                  {remainingDays} days
                </span>
                . Upgrade to Premium for infinite instant updates.
              </div>
            </motion.div>
          )}

          {/* Theme-Consistent Initial Fetch Loading State */}
          {fetchingPlans ? (
            <Loader inline />
          ) : dietPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-3xl p-16 text-center shadow-lg"
              style={{
                boxShadow: isDark
                  ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                  : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <Plus className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-zinc-700" />
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No Diet Plans Yet
              </h4>
              <p className="text-gray-500 dark:text-zinc-400 mb-6">
                Create your first personalized diet plan to get started!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenCreateModal}
                className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors cursor-pointer"
              >
                Create Your First Plan
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {dietPlans.map((plan) => (
                <motion.div
                  key={plan._id || plan.planNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-3xl overflow-hidden shadow-lg"
                  style={{
                    boxShadow: isDark
                      ? "2px 2px 12px rgba(0, 0, 0, 0.4)"
                      : "2px 2px 12px #8fa98f, -2px -2px 8px #8fa98f",
                  }}
                >
                  {/* Plan Header Card row link */}
                  <motion.div
                    whileHover={{
                      backgroundColor: isDark ? "#121b14" : "#f9fafb",
                    }}
                    onClick={() =>
                      setExpandedPlan(
                        expandedPlan === plan._id ? null : plan._id,
                      )
                    }
                    className="flex items-center justify-between p-6 cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center gap-4">
                      <PlaystoreStar number={plan.planNumber} />
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                          {plan.user?.name
                            ? plan.user.name.split(" ")[0]
                            : "User"}
                          's Diet Plan
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">
                          Created on {formatDate(plan.createdAt)}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedPlan === plan._id ? 90 : 0 }}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                    </motion.div>
                  </motion.div>

                  {/* Inner Target Metric Grid Content Panels */}
                  <AnimatePresence>
                    {expandedPlan === plan._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 dark:border-green-950/20"
                      >
                        <div className="p-6 space-y-4 bg-gray-50/50 dark:bg-[#0f1d13]/60">
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                Age
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.age} yrs
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                Weight
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.weight} kg
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                Height
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.height} cm
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                BMI
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.bmi || "-"}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                Category
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200 truncate">
                                {plan.profileSnapshot?.bmi_category || "-"}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                TDEE
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.tdee || "-"}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                Region
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {plan.profileSnapshot?.region || "-"}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-[#0c130d] p-4 rounded-xl shadow-xs">
                              <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-1">
                                State
                              </p>
                              <p className="text-lg font-bold text-gray-800 dark:text-zinc-200 truncate">
                                {plan.profileSnapshot?.state || "-"}
                              </p>
                            </div>
                          </div>

                          {/* Weekly Meal Plan Container Block */}
                          <div className="space-y-3">
                            <h5 className="font-bold text-gray-800 dark:text-white">
                              Weekly Meal Plan
                            </h5>
                            {plan.days?.map((dayObj) => (
                              <div
                                key={dayObj._id || dayObj.dayNumber}
                                className="bg-white dark:bg-[#0c130d] border dark:border-zinc-800/40 p-4 rounded-xl shadow-xs"
                              >
                                <h6 className="font-bold text-green-600 dark:text-green-400 mb-2">
                                  Day {dayObj.dayNumber}
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* Breakfast Column Layout Section */}
                                  <div>
                                    <p className="text-xl font-semibold text-black dark:text-zinc-200 mb-1">
                                      Breakfast
                                    </p>
                                    <ul className="text-sm text-gray-500 dark:text-zinc-400 space-y-1">
                                      {dayObj.meals
                                        ?.find(
                                          (m) => m.mealType === "Breakfast",
                                        )
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className="font-bold text-sm text-green-500 dark:text-green-400">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Calories:
                                                </b>{" "}
                                                {item.calories} kcal
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Protein:
                                                </b>{" "}
                                                {item.protein}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Carbs:
                                                </b>{" "}
                                                {item.carbs}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Fat:
                                                </b>{" "}
                                                {item.fat}g
                                              </span>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>

                                  {/* Lunch Column Layout Section */}
                                  <div>
                                    <p className="text-xl font-semibold text-black dark:text-zinc-200 mb-1">
                                      Lunch
                                    </p>
                                    <ul className="text-sm text-gray-500 dark:text-zinc-400 space-y-1">
                                      {dayObj.meals
                                        ?.find((m) => m.mealType === "Lunch")
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className="font-bold text-sm text-green-500 dark:text-green-400">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Calories:
                                                </b>{" "}
                                                {item.calories} kcal
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Protein:
                                                </b>{" "}
                                                {item.protein}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Carbs:
                                                </b>{" "}
                                                {item.carbs}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Fat:
                                                </b>{" "}
                                                {item.fat}g
                                              </span>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>

                                  {/* Dinner Column Layout Section */}
                                  <div>
                                    <p className="text-xl font-semibold text-black dark:text-zinc-200 mb-1">
                                      Dinner
                                    </p>
                                    <ul className="text-sm text-gray-500 dark:text-zinc-400 space-y-1">
                                      {dayObj.meals
                                        ?.find((m) => m.mealType === "Dinner")
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className="font-bold text-sm text-green-500 dark:text-green-400">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Calories:
                                                </b>{" "}
                                                {item.calories} kcal
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Protein:
                                                </b>{" "}
                                                {item.protein}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Carbs:
                                                </b>{" "}
                                                {item.carbs}g
                                              </span>
                                              ,{" "}
                                              <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                <b className="text-black dark:text-white font-extrabold">
                                                  Fat:
                                                </b>{" "}
                                                {item.fat}g
                                              </span>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* POPUP MODAL FOR VIEWING BOOKMARKED RECIPES */}
      <AnimatePresence>
        {showBookmarksModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookmarksModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c130d] border dark:border-zinc-800/80 rounded-3xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-5 bg-gray-50 dark:bg-zinc-900/40 border-b dark:border-zinc-800/60 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-green-500 fill-current" />{" "}
                    Bookmarked Recipes ({savedCommunityMeals.length})
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Traditional community dishes saved to your personal shelf.
                  </p>
                </div>
                <button
                  onClick={() => setShowBookmarksModal(false)}
                  className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 flex-1 [&::-webkit-scrollbar]:hidden">
                {savedCommunityMeals.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 space-y-2">
                    <Utensils className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700 animate-pulse" />
                    <p className="text-sm font-medium">
                      Your cookbook stack is empty.
                    </p>
                    <p className="text-xs max-w-xs mx-auto">
                      Bookmark regional recipes from the swap challenges to see
                      them display here.
                    </p>
                  </div>
                ) : (
                  savedCommunityMeals.map((recipe) => (
                    <div
                      key={recipe._id}
                      className="p-4 bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-800/60 rounded-2xl space-y-2.5 shadow-xs hover:border-green-500/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex gap-2 items-center">
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-[9px] rounded-md uppercase tracking-wider">
                              {recipe.state}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                              {recipe.region} India
                            </span>
                          </div>
                          <h5 className="font-bold text-gray-800 dark:text-zinc-200 text-base mt-1.5 leading-snug">
                            {recipe.name}
                          </h5>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/5 dark:bg-green-400/5 border border-green-500/10 dark:border-green-400/10 px-3 py-2 rounded-xl">
                        {recipe.macros}
                      </p>
                      <div className="pt-2 border-t dark:border-zinc-800 text-[11px] text-gray-400 font-medium flex justify-between items-center">
                        <span>
                          Shared by: <b>{recipe.creatorName}</b>
                        </span>
                        <span className="text-[10px] text-green-500 font-bold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-md">
                          Cookbook Shelf
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creation Diet Plan Form Drawer Modal Container */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-[#0c130d] border-b border-gray-200 dark:border-green-950/20 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Create New Diet Plan
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                </motion.button>
              </div>

              <form onSubmit={handleCreatePlan} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData?.name?.split(" ")[0] || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 text-gray-950 dark:text-white cursor-not-allowed opacity-75 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={
                        userData?.name?.split(" ").slice(1).join(" ") || ""
                      }
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 text-gray-950 dark:text-white cursor-not-allowed opacity-75 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={userAge}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 text-gray-950 dark:text-white cursor-not-allowed opacity-75 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={(e) =>
                        (parseFloat(e.target.value) >= 0 ||
                          e.target.value === "") &&
                        handleInputChange(e)
                      }
                      onKeyDown={(e) =>
                        (e.key === "-" || e.key === "e") && e.preventDefault()
                      }
                      required
                      min="1"
                      step="0.1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:col-span-1">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2 truncate">
                        Height (Feet)
                      </label>
                      <input
                        type="number"
                        name="feet"
                        value={formData.feet}
                        onChange={(e) =>
                          (parseFloat(e.target.value) >= 0 ||
                            e.target.value === "") &&
                          handleInputChange(e)
                        }
                        onKeyDown={(e) =>
                          (e.key === "-" || e.key === "e") && e.preventDefault()
                        }
                        required
                        min="1"
                        max="8"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2 truncate">
                        Height (Inches)
                      </label>
                      <input
                        type="number"
                        name="inches"
                        value={formData.inches}
                        onChange={(e) =>
                          (parseFloat(e.target.value) >= 0 ||
                            e.target.value === "") &&
                          handleInputChange(e)
                        }
                        onKeyDown={(e) =>
                          (e.key === "-" || e.key === "e") && e.preventDefault()
                        }
                        required
                        min="0"
                        max="11"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
                        placeholder="e.g., 9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Gender
                    </label>
                    <AutoSelect
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Food Preference
                    </label>
                    <AutoSelect
                      name="food_preference"
                      value={formData.food_preference}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "Veg", label: "Vegetarian" },
                        { value: "Eggitarian", label: "Eggetarian" },
                        { value: "Non-Veg", label: "Non-Vegetarian" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Activity Level
                    </label>
                    <AutoSelect
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "Sedentary", label: "Sedentary" },
                        { value: "Light", label: "Lightly Active" },
                        { value: "Moderate", label: "Moderately Active" },
                        { value: "Very Active", label: "Very Active" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Goal
                    </label>
                    <AutoSelect
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "Weight Loss", label: "Weight Loss" },
                        { value: "Muscle Gain", label: "Muscle Gain" },
                        { value: "Maintenance", label: "Maintenance" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Plan Duration
                    </label>
                    <AutoSelect
                      name="days"
                      value={String(formData.days)}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "7", label: "7 Days" },
                        {
                          value: "14",
                          label: userData?.isPremium
                            ? "14 Days"
                            : "14 Days (👑 Premium Only)",
                        },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Region
                    </label>
                    <AutoSelect
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "North", label: "North India" },
                        { value: "South", label: "South India" },
                        { value: "West", label: "West India" },
                        { value: "East", label: "East India" },
                        { value: "North East", label: "North-East India" },
                        { value: "Central", label: "Central India" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      State
                    </label>
                    <AutoSelect
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      options={[
                        { value: "Assam", label: "Assam" },
                        { value: "Gujarat", label: "Gujarat" },
                        { value: "Maharashtra", label: "Maharashtra" },
                        { value: "Meghalaya", label: "Meghalaya" },
                        { value: "Punjab", label: "Punjab" },
                        { value: "Rajasthan", label: "Rajasthan" },
                        { value: "Tamil Nadu", label: "Tamil Nadu" },
                        { value: "Telangana", label: "Telangana" },
                        { value: "Tripura", label: "Tripura" },
                        { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                        { value: "Uttarakhand", label: "Uttarakhand" },
                        { value: "West Bengal", label: "West Bengal" },
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Medical Conditions (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:outline-none"
                      placeholder="e.g., diabetes, hypertension"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                      Allergies (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:outline-none"
                      placeholder="e.g., peanuts, dairy"
                    />
                  </div>
                </div>
                {loading && <Loader />}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Creating Plan..." : "Generate Diet Plan"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
