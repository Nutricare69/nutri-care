import React, { useEffect, useContext, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PieChart,
  Users,
  Heart,
  Settings,
  X,
} from "lucide-react";
import { userDataContext } from "../../context/UserContext";
import NutriCareLogo from "../../assets/nutricareLogo.jpg";
import Loader from "../../components/Loader";
import ProfileSetup from "../../components/ProfileSetup";
import { useTheme } from "../../components/theme.js";

export default function Dashboard() {
  const {
    userData,
    hasPromptedPremium,
    setHasPromptedPremium,
    getCurrentUser,
  } = useContext(userDataContext);
  const [loading, setLoading] = useState(true);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer;

    if (
      userData &&
      !userData.isPremium &&
      !hasPromptedPremium &&
      !showPremiumPrompt
    ) {
      timer = setTimeout(() => {
        setShowPremiumPrompt(true);
        setHasPromptedPremium(true); // Persists globally as 'true' across sub-section changes
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [userData, hasPromptedPremium]);

  // Fetch user data on mount
  useEffect(() => {
    if (!userData) {
      getCurrentUser();
    }
  }, []);

  // Sidebar menu items mapped to routes
  const menuItems = [
    {
      id: "dietplans",
      icon: LayoutDashboard,
      label: "Diet Plans",
      path: "/dashboard",
    },
    {
      id: "analytics",
      icon: PieChart,
      label: "Analytics",
      path: "/dashboard/analytics",
    },
    {
      id: "community",
      icon: Users,
      label: "Community",
      path: "/dashboard/community",
    },
    { id: "ngo", icon: Heart, label: "NGO Support", path: "/dashboard/ngo" },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];

  // Helper to determine the active header title
  const getActiveLabel = () => {
    const currentItem = menuItems.find(
      (item) =>
        item.path === location.pathname ||
        (location.pathname === "/dashboard/" && item.path === "/dashboard"),
    );
    return currentItem ? currentItem.label : "Dashboard";
  };

  //useEffect for loading
  useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  return (
    // Outer div stays fixed to screen size, hides its own overflow
    <div className="h-screen w-full bg-[#A6D4AC]/40 dark:bg-[#060a07] flex overflow-hidden transition-colors duration-300">
      {userData && !userData.profileCompleted && <ProfileSetup />}

      {/* Sidebar - stays fixed to the left */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0, delay: 0.5 }}
        className="w-64 bg-white dark:bg-[#0c130d] shadow-xl flex flex-col z-20 flex-shrink-0 border-r border-transparent dark:border-green-950/10 transition-colors duration-300"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-green-950/20">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
              setLoading(true);
            }}
          >
            <span className="text-green-500">Nutri</span>
            <span className="text-yellow-500">Care</span>
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (location.pathname === "/dashboard/" &&
                item.path === "/dashboard");

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (location.pathname != item.path) {
                    navigate(item.path);
                    setLoading(true);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-green-950/20">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shrink-0">
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-gray-800 dark:text-zinc-200">
                {userData?.name?.split(" ")[0] || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                {userData?.email || "user@nutricare.com"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Layout Wrapper - This div handles the scrollbars */}
      <div className="flex-1 overflow-auto relative">
        {/* Inner Wrapper - This forces both Header and Main to share the same expanded width */}
        <div className="flex flex-col min-w-max min-h-full">
          {/* Top Header - stretches fully across the expanded scroll area */}
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-[#0c130d] shadow-md dark:shadow-black/20 px-8 py-3 flex items-center justify-between sticky top-0 z-10 w-full border-b border-transparent dark:border-green-950/20 transition-colors duration-300"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {getActiveLabel()}
              </h2>
              <div className="text-lg text-gray-500 dark:text-zinc-400 flex gap-2">
                Welcome back,{" "}
                <div className="font-bold text-gray-800 dark:text-zinc-200">
                  {userData?.name?.split(" ")[0] || "User"}!
                </div>
              </div>
            </div>

            <motion.div
              initial={{ x: 150, opacity: 1, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.8, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="flex items-center gap-3"
            >
              {/* Free / Premium Badge - Reduced padding and text size */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => !userData?.isPremium && navigate("/pricing")}
                className={`flex items-center justify-center px-3 py-1.5 rounded-full font-bold text-xs shadow-sm cursor-pointer transition-colors ${
                  userData?.isPremium
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border border-yellow-300"
                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 border border-gray-300 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {userData?.isPremium
                  ? "🏆 Premium Active"
                  : "Free Plan - Upgrade"}
              </motion.div>

              {/* Logo - Size reduced cleanly from h-25 w-30 down to h-12 w-14 */}
              <img
                src={NutriCareLogo}
                alt="NutriCare Logo"
                className="rounded-full h-12 w-14 object-cover object-center"
              />
            </motion.div>
          </motion.header>

          {/* Dynamic Nested Page Rendering */}
          {loading ? (
            <Loader />
          ) : (
            <main className="p-8 flex-1">
              <Outlet />
            </main>
          )}
        </div>
      </div>

      {/* --- PREMIUM UPGRADE POPUP --- */}
      <AnimatePresence>
        {showPremiumPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-8 right-8 z-50 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-6 border-l-4 border-yellow-400 dark:border-yellow-500 max-w-sm border border-transparent dark:border-zinc-800/80"
          >
            <button
              onClick={() => setShowPremiumPrompt(false)}
              className="absolute top-3 right-3 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">✨</div>
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                Unlock Premium
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4">
              Get personalized AI meal plans, 1-on-1 expert chat, and ad-free
              experience today!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/pricing")}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-xl shadow transition-colors flex-1 text-sm"
              >
                View Plans
              </button>
              <button
                onClick={() => setShowPremiumPrompt(false)}
                className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
