import React, { useState, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContextProvider.jsx";
import { useTheme } from "./theme.js";

export default function ProfileSetup() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom Calendar State Architecture
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState("days"); // 'days' | 'months' | 'years'

  const currentYear = new Date().getFullYear();
  const [navYear, setNavYear] = useState(currentYear - 25); // Default viewport context to standard adult demographic ages
  const [navMonth, setNavMonth] = useState(new Date().getMonth());

  const dropdownRef = useRef(null);
  const { getCurrentUser } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { isDark } = useTheme();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Close calendar popup automatically when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Compute Days Matrix Structure dynamically
  const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
  const firstDayIndex = new Date(navYear, navMonth, 1).getDay();

  const blankDaysCells = Array.from({ length: firstDayIndex }, (_, i) => null);
  const validDaysCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalGridCells = [...blankDaysCells, ...validDaysCells];

  // Year Range Navigation Computations
  const startYearRange = Math.floor(navYear / 12) * 12;
  const yearOptionsArray = Array.from(
    { length: 12 },
    (_, i) => startYearRange + i,
  );

  const handleMonthPrev = () => {
    if (navMonth === 0) {
      setNavMonth(11);
      setNavYear((prev) => prev - 1);
    } else {
      setNavMonth((prev) => prev - 1);
    }
  };

  const handleMonthNext = () => {
    if (navMonth === 11) {
      setNavMonth(0);
      setNavYear((prev) => prev + 1);
    } else {
      setNavMonth((prev) => prev + 1);
    }
  };

  const handleDaySelect = (day) => {
    const formattedMonth = String(navMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const compiledString = `${navYear}-${formattedMonth}-${formattedDay}`;

    if (new Date(compiledString) > new Date()) {
      toast.warn("Birthdates cannot be set in the future.");
      return;
    }

    setDateOfBirth(compiledString);
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateOfBirth) {
      toast.warn("Please select your date of birth to continue.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${serverUrl}/api/user/complete-profile`,
        { dateOfBirth },
        { withCredentials: true },
      );
      toast.success("Profile setup completed successfully! Welcome aboard.");
      await getCurrentUser();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        /* FIXED: Changed to overflow-visible and added a clean 4px border-t rule that respects corner radius boundaries perfectly */
        className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-800/20 border-t-4 border-t-green-400 rounded-3xl w-full max-w-md p-8 md:p-10 relative overflow-visible"
        style={{
          boxShadow: isDark
            ? "0px 10px 30px rgba(0, 0, 0, 0.5)"
            : "0px 10px 30px rgba(74, 158, 74, 0.2)",
        }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            Welcome!
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm md:text-base">
            Let's personalize your experience. When is your birthday?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative z-20" ref={dropdownRef}>
            <label
              htmlFor="dob"
              className="text-sm font-semibold text-gray-700 dark:text-zinc-300 ml-1"
            >
              Date of Birth
            </label>

            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setCurrentView("days");
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 text-gray-800 dark:text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">
                  {dateOfBirth
                    ? new Date(dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select Birthday"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-[#0c130d] border border-gray-200 dark:border-green-800/30 rounded-2xl shadow-xl z-50 flex flex-col min-h-[300px]"
                >
                  {/* Calendar View Header Panel Switches */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={
                        currentView === "years"
                          ? () => setNavYear((prev) => prev - 12)
                          : handleMonthPrev
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex gap-1 text-xs font-bold text-gray-700 dark:text-zinc-200 tracking-wide">
                      <button
                        type="button"
                        onClick={() => setCurrentView("months")}
                        className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors text-green-600 dark:text-green-400 cursor-pointer"
                      >
                        {months[navMonth]}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentView("years")}
                        className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors text-green-600 dark:text-green-400 cursor-pointer"
                      >
                        {navYear}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={
                        currentView === "years"
                          ? () => setNavYear((prev) => prev + 12)
                          : handleMonthNext
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* VIEW LAYER A: PRECISE DAY GRID INDEX VIEWER */}
                  {currentView === "days" && (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 tracking-wider mb-1">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 flex-1 text-center items-center">
                        {totalGridCells.map((day, cellIndex) => {
                          if (day === null)
                            return <div key={`empty-${cellIndex}`} />;

                          const targetCheckStr = `${navYear}-${String(navMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const isSelected = dateOfBirth === targetCheckStr;

                          return (
                            <button
                              key={`day-${day}`}
                              type="button"
                              onClick={() => handleDaySelect(day)}
                              className={`w-8 h-8 mx-auto text-xs font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-green-500 text-white font-bold scale-105 shadow-sm"
                                  : "text-gray-700 dark:text-zinc-300 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* VIEW LAYER B: MONTH SELECTION DIRECT CARD VIEW */}
                  {currentView === "months" && (
                    <div className="grid grid-cols-3 gap-2 m-auto w-full">
                      {months.map((m, index) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setNavMonth(index);
                            setCurrentView("days");
                          }}
                          className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            navMonth === index
                              ? "bg-green-500 text-white shadow-sm"
                              : "bg-gray-50 dark:bg-zinc-900/40 text-gray-700 dark:text-zinc-300 border border-gray-100 dark:border-zinc-800 hover:border-green-400"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* VIEW LAYER C: YEAR MATRIX SLIDING WINDOW VIEWER */}
                  {currentView === "years" && (
                    <div className="grid grid-cols-3 gap-2 m-auto w-full">
                      {yearOptionsArray.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => {
                            setNavYear(y);
                            setCurrentView("days");
                          }}
                          className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            navYear === y
                              ? "bg-green-500 text-white shadow-sm"
                              : "bg-gray-50 dark:bg-zinc-900/40 text-gray-700 dark:text-zinc-300 border border-gray-100 dark:border-zinc-800 hover:border-green-400"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-amber-100 font-bold text-lg py-3 rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-amber-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
