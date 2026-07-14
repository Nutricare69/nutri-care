import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Target,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  ActivitySquare,
  AlertTriangle, //  NEW: Warning icon for offline states
} from "lucide-react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";
import { useTheme } from "../../components/theme.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Analytics() {
  const { serverUrl } = useContext(authDataContext);
  const { isDark } = useTheme();
  const [dietPlans, setDietPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineView, setIsOfflineView] = useState(false); //  NEW: Active component connection tracker

  // Track selected day per plan (defaults to 1 when a plan is opened)
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  // State specifically for the animated Macro data
  const [animatedMacroData, setAnimatedMacroData] = useState([0, 0, 0]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const PlaystoreStar = ({ number }) => {
    return (
      <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
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

  const fetchDietPlans = async () => {
    //  NEW: Offline Interceptor Layer
    // Check if network status is down, if so pull immediately from local disk cache storage
    if (!navigator.onLine) {
      const localPlans = localStorage.getItem("nutricare_cached_diet_plans");
      setDietPlans(localPlans ? JSON.parse(localPlans) : []);
      setIsOfflineView(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${serverUrl}/api/generate/all-plans`, {
        withCredentials: true,
      });
      const plansData = response.data || [];
      setDietPlans(plansData);

      // Seed backup records back down into local cache storage lines cleanly
      localStorage.setItem(
        "nutricare_cached_diet_plans",
        JSON.stringify(plansData),
      );
      setIsOfflineView(false);
    } catch (error) {
      console.error(
        "Error fetching diet plans for analytics, falling back to cache:",
        error,
      );
      const localPlans = localStorage.getItem("nutricare_cached_diet_plans");
      setDietPlans(localPlans ? JSON.parse(localPlans) : []);
      setIsOfflineView(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      fetchDietPlans();
    }
  }, [serverUrl]);

  // Effect to trigger a sweep/shrink animation on day change
  useEffect(() => {
    setAnimatedMacroData([0, 0, 0]);

    const timer = setTimeout(() => {
      let currentPlan = dietPlans.find((p) => p._id === expandedPlan);
      if (currentPlan) {
        let tProt = 0,
          tFat = 0,
          tCarbs = 0;
        const targetDay = currentPlan.days?.find(
          (d) => d.dayNumber === selectedDayNumber,
        );
        if (targetDay && targetDay.meals) {
          targetDay.meals.forEach((meal) => {
            if (meal.foods) {
              meal.foods.forEach((food) => {
                tProt += food.protein || 0;
                tFat += food.fat || 0;
                tCarbs += food.carbs || 0;
              });
            }
          });
        }
        setAnimatedMacroData([
          Number(tProt.toFixed(2)),
          Number(tFat.toFixed(2)),
          Number(tCarbs.toFixed(2)),
        ]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedDayNumber, expandedPlan, dietPlans]);

  const togglePlan = (id) => {
    if (expandedPlan === id) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(id);
      setSelectedDayNumber(1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="analytics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6 pb-10"
      >
        {/* Premium Layout Accent Header Integration Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-green-500 rounded-full" />
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Your Nutrition Analytics
            </h3>
          </div>
        </div>

        {/*  NEW: Local Sub-Page Workspace Offline View Alert Banner */}
        {isOfflineView && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3.5"
          >
            <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Offline mode active. Connect to the internet to update your live
              nutrition graphs!
            </div>
          </motion.div>
        )}

        {loading && <Loader inline />}

        {!loading && dietPlans.length === 0 && (
          <motion.div
            className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-3xl p-16 text-center shadow-lg"
            style={{
              boxShadow: isDark
                ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
            }}
          >
            <ActivitySquare className="w-16 h-16 text-green-200 dark:text-green-950 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No Analytics Available
            </h4>
            <p className="text-gray-500 dark:text-zinc-400">
              Generate a diet plan first to see your nutritional insights.
            </p>
          </motion.div>
        )}

        {!loading &&
          dietPlans.map((plan) => {
            const isExpanded = expandedPlan === plan._id;

            // Theme-aware Chart.js Configurations
            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: isDark ? "#e4e4e7" : "#374151",
                    font: {
                      weight: "bold",
                    },
                  },
                },
                tooltip: {
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  titleColor: isDark ? "#ffffff" : "#1f2937",
                  bodyColor: isDark ? "#e4e4e7" : "#4b5563",
                  borderColor: isDark ? "#27272a" : "#e5e7eb",
                  borderWidth: 1,
                },
              },
              scales: {
                x: {
                  grid: {
                    color: isDark
                      ? "rgba(63, 63, 70, 0.3)"
                      : "rgba(229, 231, 235, 0.5)",
                  },
                  ticks: {
                    color: isDark ? "#a1a1aa" : "#4b5563",
                  },
                },
                y: {
                  grid: {
                    color: isDark
                      ? "rgba(63, 63, 70, 0.3)"
                      : "rgba(229, 231, 235, 0.5)",
                  },
                  ticks: {
                    color: isDark ? "#a1a1aa" : "#4b5563",
                  },
                },
              },
            };

            const pieChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: isDark ? "#e4e4e7" : "#374151",
                    font: {
                      weight: "bold",
                    },
                  },
                },
                tooltip: {
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  titleColor: isDark ? "#ffffff" : "#1f2937",
                  bodyColor: isDark ? "#e4e4e7" : "#4b5563",
                  borderColor: isDark ? "#27272a" : "#e5e7eb",
                  borderWidth: 1,
                },
              },
            };

            const targetCals = plan.profileSnapshot?.tdee || 2000;
            const targetProt = (targetCals * 0.35) / 4;
            const targetFat = (targetCals * 0.2) / 9;
            const targetCarbs = (targetCals * 0.45) / 4;

            const calculateDayTotals = (dayNumber) => {
              let tCals = 0,
                tProt = 0,
                tFat = 0,
                tCarbs = 0;
              const targetDay = plan.days?.find(
                (d) => d.dayNumber === dayNumber,
              );

              if (targetDay && targetDay.meals) {
                targetDay.meals.forEach((meal) => {
                  if (meal.foods) {
                    meal.foods.forEach((food) => {
                      tCals += food.calories || 0;
                      tProt += food.protein || 0;
                      tFat += food.fat || 0;
                      tCarbs += food.carbs || 0;
                    });
                  }
                });
              }
              return {
                total_calories: tCals,
                total_protein: tProt,
                total_fat: tFat,
                total_carbs: tCarbs,
              };
            };

            const currentDayTotals = calculateDayTotals(selectedDayNumber);
            const allDayNumbers =
              plan.days?.map((d) => d.dayNumber).sort((a, b) => a - b) || [];

            const trendCalsData = allDayNumbers.map(
              (num) => calculateDayTotals(num).total_calories,
            );

            const macroData = {
              labels: ["Protein (g)", "Fat (g)", "Carbs (g)"],
              datasets: [
                {
                  data: animatedMacroData,
                  backgroundColor: ["#ef4444", "#eab308", "#3b82f6"],
                  hoverBackgroundColor: ["#dc2626", "#ca8a04", "#2563eb"],
                  borderWidth: 0,
                  hoverOffset: 4,
                },
              ],
            };

            const targetVsActualData = {
              labels: ["Calories", "Protein", "Fat", "Carbs"],
              datasets: [
                {
                  label: "Generated Intake",
                  data: [
                    Number(currentDayTotals.total_calories.toFixed(2)),
                    Number(currentDayTotals.total_protein.toFixed(2)),
                    Number(currentDayTotals.total_fat.toFixed(2)),
                    Number(currentDayTotals.total_carbs.toFixed(2)),
                  ],
                  backgroundColor: "#22c55e",
                  borderRadius: 4,
                },
                {
                  label: "Target Required",
                  data: [
                    Number(targetCals.toFixed(2)),
                    Number(targetProt.toFixed(2)),
                    Number(targetFat.toFixed(2)),
                    Number(targetCarbs.toFixed(2)),
                  ],
                  backgroundColor: isDark ? "#3f3f46" : "#d1d5db",
                  borderRadius: 4,
                },
              ],
            };

            const trendDataChart = {
              labels: allDayNumbers.map((num) => `Day ${num}`),
              datasets: [
                {
                  label: "Generated Daily Calories",
                  data: trendCalsData,
                  borderColor: "#22c55e",
                  backgroundColor: "rgba(34, 197, 94, 0.2)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: "#22c55e",
                },
                {
                  label: "Target Caloric Baseline",
                  data: allDayNumbers.map(() => targetCals),
                  borderColor: isDark ? "#52525b" : "#9ca3af",
                  borderDash: [5, 5],
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                },
              ],
            };

            return (
              <motion.div
                layout
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0c130d] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-transparent"
                style={{
                  boxShadow: isDark
                    ? "2px 2px 12px rgba(0, 0, 0, 0.4)"
                    : "2px 2px 12px #8fa98f, -2px -2px 8px #8fa98f",
                }}
              >
                {/* Plan Header (Clickable) */}
                <motion.div
                  whileHover={{
                    backgroundColor: isDark ? "#121b14" : "#f9fafb",
                  }}
                  onClick={() => togglePlan(plan._id)}
                  className="flex items-center justify-between p-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4 ">
                    <PlaystoreStar number={plan.planNumber} />
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                        {plan.user?.name?.split(" ")[0] || "Your"}'s Analytics
                        Plan
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        Generated on {formatDate(plan.createdAt)}
                      </p>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                    <ChevronRight className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                  </motion.div>
                </motion.div>

                {/* Accordion Expandable Body */}
                <AnimatePresence>
                  {isExpanded && plan.days && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-green-950/20 overflow-hidden"
                    >
                      <div className="p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-[#0f1d13]/60 text-sm">
                        {/* Day Selector Ribbon */}
                        <div
                          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-2"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          {allDayNumbers.map((num) => (
                            <motion.button
                              key={num}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedDayNumber(num)}
                              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 text-sm md:text-base md:px-5 md:py-2.5 rounded-full font-semibold transition-all shadow-sm flex-shrink-0 cursor-pointer ${
                                selectedDayNumber === num
                                  ? "bg-green-500 text-white shadow-md shadow-green-950/35"
                                  : "bg-white dark:bg-zinc-900/60 dark:border dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-green-100 dark:hover:bg-green-950/40"
                              }`}
                            >
                              <CalendarDays className="w-4 h-4" /> Day {num}
                            </motion.button>
                          ))}
                        </div>

                        {/* Analytics Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
                          {/* Macro Balance container isolated */}
                          <div className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/10 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-transparent flex flex-col w-full min-w-0">
                            <h4 className="text-gray-800 dark:text-zinc-200 font-bold mb-4 text-center">
                              Macro Balance - Day {selectedDayNumber}
                            </h4>
                            <div className="relative w-full h-[250px] flex items-center justify-center">
                              <Pie
                                key={`pie-${selectedDayNumber}-${isDark}`}
                                data={macroData}
                                options={pieChartOptions}
                              />
                            </div>
                          </div>

                          {/* Intake Vs Targets container isolated */}
                          <div className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/10 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-transparent flex flex-col w-full min-w-0">
                            <h4 className="flex items-center gap-2 text-gray-800 dark:text-zinc-200 font-bold mb-4">
                              <Target className="w-5 h-5 text-blue-500" />{" "}
                              Intake vs Targets
                            </h4>
                            <div className="relative w-full h-[250px]">
                              <Bar
                                key={`bar-${selectedDayNumber}-${isDark}`}
                                data={targetVsActualData}
                                options={chartOptions}
                              />
                            </div>
                          </div>

                          {/* Caloric Trend Chart Container */}
                          <div className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/10 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-transparent w-full min-w-0 lg:col-span-2">
                            <h4 className="flex items-center gap-2 text-gray-800 dark:text-zinc-200 font-bold mb-4">
                              <TrendingUp className="w-5 h-5 text-green-500" />{" "}
                              Meal Plan Caloric Trend
                            </h4>
                            <div
                              className={`relative h-[300px] ${allDayNumbers.length > 7 ? "min-w-[800px]" : "w-full"}`}
                            >
                              <Line
                                key={`line-${isDark}`}
                                data={trendDataChart}
                                options={{
                                  ...chartOptions,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      suggestedMax: targetCals + 500,
                                      grid: {
                                        color: isDark
                                          ? "rgba(63, 63, 70, 0.3)"
                                          : "rgba(229, 231, 235, 0.5)",
                                      },
                                      ticks: {
                                        color: isDark ? "#a1a1aa" : "#4b5563",
                                      },
                                    },
                                    x: {
                                      grid: {
                                        color: isDark
                                          ? "rgba(63, 63, 70, 0.3)"
                                          : "rgba(229, 231, 235, 0.5)",
                                      },
                                      ticks: {
                                        color: isDark ? "#a1a1aa" : "#4b5563",
                                      },
                                    },
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </motion.div>
    </AnimatePresence>
  );
}
