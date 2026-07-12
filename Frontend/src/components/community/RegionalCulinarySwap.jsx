import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Bookmark,
  X,
  Utensils,
  Globe,
  Check,
  FileText,
  Sparkles,
  Send,
  Trophy,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify"; // 🟢 NEW: Integrated Toastify engine
import { authDataContext } from "../../context/AuthContextProvider";
import { userDataContext } from "../../context/UserContext";

export default function RegionalVegetarianSwapWorkspace({ challenge }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData, triggerPointAwardEffect } = useContext(userDataContext);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareTray, setShowShareTray] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");

  // Real-time parsed dynamic user tracking targets
  const [userRealMeals, setUserRealMeals] = useState([]);
  const [loadingMyMeals, setLoadingMyMeals] = useState(false);

  // Manual Form Inputs
  const [customName, setCustomName] = useState("");
  const [customMacros, setCustomMacros] = useState("");

  // State hooks for dynamic form tracking initialized with profile defaults
  const [customState, setCustomState] = useState(
    userData?.state || "Maharashtra",
  );
  const [customRegion, setCustomRegion] = useState(userData?.region || "West");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  // Dynamically compute if the current logged-in user has contributed to this pool
  const hasUserContributed = recipes.some(
    (recipe) => recipe.user === userData?._id,
  );

  const fetchRecipesAndBookmarks = async () => {
    try {
      const poolResponse = await axios.get(
        `${serverUrl}/api/challenges/recipes/${challenge._id}`,
        { withCredentials: true },
      );
      setRecipes(poolResponse.data || []);

      const bookmarksResponse = await axios.get(
        `${serverUrl}/api/challenges/recipes/saved`,
        { withCredentials: true },
      );
      const bookmarkedIds = (bookmarksResponse.data || []).map(
        (recipe) => recipe._id,
      );
      setSavedRecipeIds(bookmarkedIds);
    } catch (error) {
      console.error("Error syncing recipe pool data layers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipesAndBookmarks();
  }, [challenge._id, serverUrl]);

  const fetchMyAiMeals = async () => {
    setLoadingMyMeals(true);
    try {
      const response = await axios.get(`${serverUrl}/api/generate/latest`, {
        withCredentials: true,
      });

      const latestPlan = response.data;
      const flatFoodsList = [];

      if (latestPlan && latestPlan.days) {
        latestPlan.days.forEach((dayObj) => {
          dayObj.meals.forEach((mealObj) => {
            mealObj.foods.forEach((food) => {
              const formattedMacrosString = `${food.calories} kcal | ${food.protein}g P | ${food.carbs}g C`;
              const alreadyAdded = flatFoodsList.some(
                (item) => item.name.toLowerCase() === food.name.toLowerCase(),
              );

              if (!alreadyAdded) {
                flatFoodsList.push({
                  name: food.name,
                  macros: formattedMacrosString,
                  state:
                    latestPlan.profileSnapshot?.state ||
                    userData?.state ||
                    "Local",
                  region:
                    latestPlan.profileSnapshot?.region ||
                    userData?.region ||
                    "Shared",
                });
              }
            });
          });
        });
      }
      setUserRealMeals(flatFoodsList);
    } catch (error) {
      console.error("Error unravelling nested database schemas:", error);
      setUserRealMeals([]);
    } finally {
      setLoadingMyMeals(false);
    }
  };

  const handleToggleTray = () => {
    if (!showShareTray && activeTab === "ai") {
      fetchMyAiMeals();
    }
    setShowShareTray(!showShareTray);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "ai" && userRealMeals.length === 0) {
      fetchMyAiMeals();
    }
  };

  const executePublish = async (recipePayload) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/recipes/${challenge._id}/share`,
        recipePayload,
        { withCredentials: true },
      );
      setRecipes((prev) => [response.data, ...prev]);
      const userHasAlreadyContributed = recipes.some(
        (recipe) => recipe.user === userData?._id,
      );
      if (!userHasAlreadyContributed) {
        try {
          await axios.post(
            `${serverUrl}/api/points/claim`,
            { challengeId: challenge._id, pointsToAward: 100 },
            { withCredentials: true },
          );
          setTimeout(() => {
            triggerPointAwardEffect(100);
          }, 600);
        } catch (err) {
          console.log("Points already claimed previously.");
        }
      }
      setShowShareTray(false);
      setCustomName("");
      setCustomMacros("");
      toast.success(
        `"${recipePayload.name}" successfully published to the community pool!`,
      ); // 🟢 NEW: Success notification for sharing
    } catch (error) {
      console.error("Failed to upload recipe payload:", error);
      toast.error("Could not share recipe configuration to server."); // 🟢 FIXED: Swapped alert for toast
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!customName.trim() || !customMacros.trim()) {
      return toast.warn("Please fulfill all custom field parameters."); // 🟢 FIXED: Swapped alert for warning toast
    }
    setIsSubmittingForm(true);
    await executePublish({
      name: customName,
      region: customRegion,
      state: customState,
      macros: customMacros,
    });
    setIsSubmittingForm(false);
  };

  const handleBookmarkRecipe = async (recipeId) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/challenges/recipes/save/${recipeId}`,
        {},
        { withCredentials: true },
      );
      toast.success(
        response.data.message ||
          "Recipe successfully cataloged into your cookbook shelf!",
      ); // 🟢 FIXED: Swapped alert for toast
      setSavedRecipeIds((prev) => [...prev, recipeId]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to finalize cookbook bookmark save.",
      ); // 🟢 FIXED: Swapped alert for toast
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-xs text-gray-400 font-bold">
        Syncing Shared Recipe Pools...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Persistent Milestone Achievement Banner */}
      <AnimatePresence>
        {hasUserContributed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 max-w-xl mx-auto"
          >
            <div className="p-2 bg-green-500 text-white rounded-xl shadow-sm shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h6 className="font-bold text-gray-800 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                Target Milestone Achieved!{" "}
                <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                  Goal: 1 Recipe
                </span>
              </h6>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                You have successfully contributed to the regional database. Feel
                free to keep sharing more dishes to help grow the community
                pool!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Control Header Banner */}
      <div className="p-4 bg-green-50/50 dark:bg-green-950/10 rounded-2xl border border-green-100 dark:border-green-900/30 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-zinc-300">
          {challenge.description}
        </p>
        <button
          onClick={handleToggleTray}
          className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold shadow shrink-0 cursor-pointer transition-colors"
        >
          {showShareTray ? "Close Drawers" : "Share a Recipe"}
        </button>
      </div>

      {/* Dual Tab Share Section Drawer */}
      <AnimatePresence>
        {showShareTray && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-dashed border-green-300 dark:border-green-800/40 p-5 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/20 space-y-4"
          >
            {/* Tab Controls */}
            <div className="flex gap-2 p-1 bg-gray-200/60 dark:bg-zinc-800/80 rounded-xl max-w-xs">
              <button
                type="button"
                onClick={() => handleTabChange("ai")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === "ai" ? "bg-white dark:bg-zinc-900 text-green-600 shadow-sm" : "text-gray-500"}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("manual")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${activeTab === "manual" ? "bg-white dark:bg-zinc-900 text-green-600 shadow-sm" : "text-gray-500"}`}
              >
                <FileText className="w-3.5 h-3.5" /> Custom Form
              </button>
            </div>

            {/* TAB CONTENT A: DYNAMIC ACTIVE AI MEAL EXTRACTOR */}
            {activeTab === "ai" && (
              <div className="space-y-2">
                <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select an authentic item directly from your most recent plan
                  configuration:
                </h6>
                {loadingMyMeals ? (
                  <p className="text-xs text-gray-400 py-4 text-center animate-pulse">
                    De-nesting live plan food structures...
                  </p>
                ) : userRealMeals.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    No recent AI generated meal configurations found. Create a
                    plan first to show items!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {userRealMeals.map((meal, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          executePublish({
                            name: meal.name,
                            region: meal.region,
                            state: meal.state,
                            macros: meal.macros,
                          })
                        }
                        className="p-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl cursor-pointer hover:border-green-400 flex flex-col justify-between group transition-all"
                      >
                        <div>
                          <span className="text-[9px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-1.5 py-0.5 rounded-md">
                            {meal.state}
                          </span>
                          <h4 className="block font-bold text-gray-800 dark:text-zinc-200 text-xs mt-1.5">
                            {meal.name}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t dark:border-zinc-800 text-[10px] text-gray-400">
                          <span>{meal.macros}</span>
                          <span className="text-green-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Share +
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT B: HANDMADE INPUT FORM WITH SELECT DROPDOWNS */}
            {activeTab === "manual" && (
              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Recipe Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., Homemade Punjabi Chole"
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-medium rounded-xl focus:outline-none focus:border-green-400 text-gray-800 dark:text-zinc-100 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Macros Profile
                    </label>
                    <input
                      type="text"
                      value={customMacros}
                      onChange={(e) => setCustomMacros(e.target.value)}
                      placeholder="e.g., 240 kcal | 8g Protein | 35g Carbs"
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-medium rounded-xl focus:outline-none focus:border-green-400 text-gray-800 dark:text-zinc-100 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Region Selector Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Origin Region
                    </label>
                    <select
                      value={customRegion}
                      onChange={(e) => setCustomRegion(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-medium rounded-xl focus:outline-none focus:border-green-400 text-gray-800 dark:text-zinc-100 cursor-pointer"
                    >
                      <option value="North">North India</option>
                      <option value="South">South India</option>
                      <option value="West">West India</option>
                      <option value="East">East India</option>
                      <option value="North East">North-East India</option>
                      <option value="Central">Central India</option>
                    </select>
                  </div>

                  {/* State Selector Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Origin State
                    </label>
                    <select
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-medium rounded-xl focus:outline-none focus:border-green-400 text-gray-800 dark:text-zinc-100 cursor-pointer"
                    >
                      <option value="Assam">Assam</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />{" "}
                    {isSubmittingForm ? "Publishing..." : "Publish To Pool"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Shared Feed */}
      <div className="space-y-4">
        <h5 className="font-bold text-sm text-gray-400 dark:text-zinc-500 tracking-wider uppercase flex items-center gap-1">
          <Globe className="w-4 h-4" /> Live Community Recipe Pool (
          {recipes.length})
        </h5>
        {recipes.length === 0 ? (
          <p className="text-center py-6 text-sm text-gray-400 border border-dashed rounded-2xl">
            No recipes shared in this swap loop yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recipes.map((recipe) => {
              const isBookmarked = savedRecipeIds.includes(recipe._id);

              return (
                <div
                  key={recipe._id}
                  className="p-4 bg-white dark:bg-[#0c130d]/40 border border-gray-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold text-[10px] rounded-md">
                        {recipe.state}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Shared by {recipe.creatorName}
                      </span>
                    </div>
                    <h6 className="font-bold text-gray-800 dark:text-zinc-200 text-base">
                      {recipe.name}
                    </h6>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
                      {recipe.macros}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      !isBookmarked && handleBookmarkRecipe(recipe._id)
                    }
                    disabled={isBookmarked}
                    className={`p-3 rounded-xl border shadow-xs transition-colors shrink-0 ${
                      isBookmarked
                        ? "bg-green-500 border-green-500 text-white cursor-not-allowed"
                        : "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-green-500 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? "fill-white text-white" : ""}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
