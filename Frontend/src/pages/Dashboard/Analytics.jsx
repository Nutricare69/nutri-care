import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Target,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  ActivitySquare,
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
  const [dietPlans, setDietPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null); // Starts as null, so all are closed initially
  const [loading, setLoading] = useState(true);

  // Track selected day per plan (defaults to 1 when a plan is opened)
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  // NEW: State specifically for the animated Macro data
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
        <span className="relative z-10 text-white font-bold text-xs bg-black/35 w-10 h-10 flex flex-col items-center justify-center rounded-full backdrop-blur-sm">
          <span className="text-[9px] leading-none text-gray-200">Plan</span>
          <span className="leading-none">{number}</span>
        </span>
      </div>
    );
  };

  const fetchDietPlans = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/generate/all-plans`, {
        withCredentials: true,
      });
      setDietPlans(response.data || []);
    } catch (error) {
      console.error("Error fetching diet plans for analytics:", error);
    } finally {
      // Loader finishes immediately
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlans();
  }, []);

  // NEW: Effect to trigger a sweep/shrink animation on day change
  useEffect(() => {
    // 1. Immediately drop the values to 0 to trigger the shrinking animation
    setAnimatedMacroData([0, 0, 0]);

    // 2. Wait just long enough for the user to visually perceive the change (e.g., 50ms)
    const timer = setTimeout(() => {
      // We need to calculate the totals for the current day here to feed the state
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
        // 3. Set the actual data, triggering the sweeping "grow" animation
        setAnimatedMacroData([
          Number(tProt.toFixed(2)),
          Number(tFat.toFixed(2)),
          Number(tCarbs.toFixed(2)),
        ]);
      }
    }, 100); // 100 millisecond delay

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
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
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500" />
            Your Nutrition Analytics
          </h3>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}

        {!loading && dietPlans.length === 0 && (
          <motion.div
            className="bg-white rounded-3xl p-16 text-center shadow-lg"
            style={{
              boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
            }}
          >
            <ActivitySquare className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              No Analytics Available
            </h4>
            <p className="text-gray-500">
              Generate a diet plan first to see your nutritional insights.
            </p>
          </motion.div>
        )}

        {!loading &&
          dietPlans.map((plan) => {
            const isExpanded = expandedPlan === plan._id;

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

            // 1. Doughnut Chart: Macronutrient Balance
            const macroData = {
              labels: ["Protein (g)", "Fat (g)", "Carbs (g)"],
              datasets: [
                {
                  // USE THE ANIMATED VARIABLE HERE:
                  data: animatedMacroData,
                  backgroundColor: ["#ef4444", "#eab308", "#3b82f6"],
                  hoverBackgroundColor: ["#dc2626", "#ca8a04", "#2563eb"],
                  borderWidth: 0,
                  hoverOffset: 4,
                },
              ],
            };

            // 2. Bar Chart: Actual Intake vs Daily Targets
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
                  backgroundColor: "#d1d5db",
                  borderRadius: 4,
                },
              ],
            };

            // 3. Line Chart: Overall Caloric Trend
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
                  borderColor: "#9ca3af",
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
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
                style={{
                  boxShadow: "2px 2px 12px #8fa98f, -2px -2px 8px #8fa98f",
                }}
              >
                {/* Plan Header (Clickable) */}
                <motion.div
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  onClick={() => togglePlan(plan._id)}
                  className="flex items-center justify-between p-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <PlaystoreStar number={plan.planNumber} />
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {plan.user?.name?.split(" ")[0] || "Your"}'s Analytics
                        Plan
                      </h4>
                      <p className="text-sm text-gray-500">
                        Generated on {formatDate(plan.createdAt)}
                      </p>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </motion.div>

                {/* Accordion Expandable Body */}
                <AnimatePresence>
                  {isExpanded && plan.days && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 overflow-hidden"
                    >
                      <div className="p-4 md:p-6 space-y-6 bg-gray-50 text-sm">
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
                              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 text-sm md:text-base md:px-5 md:py-2.5 rounded-full font-semibold transition-all shadow-sm flex-shrink-0 ${
                                selectedDayNumber === num
                                  ? "bg-green-500 text-white shadow-md shadow-green-200"
                                  : "bg-white text-gray-600 hover:bg-green-100"
                              }`}
                            >
                              <CalendarDays className="w-4 h-4" /> Day {num}
                            </motion.button>
                          ))}
                        </div>

                        {/* Analytics Charts Grid */}
                        {/* the key change here is "min-w-0" to prevent grid blowout! */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
                          {/* Macro Balance container isolated */}
                          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col w-full min-w-0">
                            <h4 className="text-gray-800 font-bold mb-4 text-center">
                              Macro Balance - Day {selectedDayNumber}
                            </h4>
                            <div className="relative w-full h-[250px] flex items-center justify-center">
                              {/* Change Doughnut to Pie, and remove cutout */}
                              <Pie
                                key={`pie-${selectedDayNumber}`} // Updating key name for clarity
                                data={macroData}
                                options={chartOptions}
                              />
                            </div>
                          </div>

                          {/* Intake Vs Targets container isolated */}
                          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col w-full min-w-0">
                            <h4 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                              <Target className="w-5 h-5 text-blue-500" />{" "}
                              Intake vs Targets
                            </h4>
                            <div className="relative w-full h-[250px]">
                              <Bar
                                data={targetVsActualData}
                                options={chartOptions}
                              />
                            </div>
                          </div>

                          {/* 14 Day Trend container isolated */}
                          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 w-full min-w-0 lg:col-span-2">
                            <h4 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                              <TrendingUp className="w-5 h-5 text-green-500" />{" "}
                              Meal Plan Caloric Trend
                            </h4>
                            {/* Inner container forced to be at least 800px wide if there's more than 7 days */}
                            <div
                              className={`relative h-[300px] ${allDayNumbers.length > 7 ? "min-w-[800px]" : "w-full"}`}
                            >
                              <Line
                                data={trendDataChart}
                                options={{
                                  ...chartOptions,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      suggestedMax: targetCals + 500,
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
