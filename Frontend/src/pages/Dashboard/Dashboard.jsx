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
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu, // 🟢 NEW: Hamburger menu icon asset import
} from "lucide-react";

import { userDataContext } from "../../context/UserContext";
import NutriCareLogo from "../../assets/nutricareLogo.jpg";
import Loader from "../../components/Loader";
import ProfileSetup from "../../components/ProfileSetup";
import { useTheme } from "../../components/theme.js";
import EarningCoinPopup from "../../components/coin/EarningCoinPopup.jsx";

export default function Dashboard() {
  const {
    userData,
    hasPromptedPremium,
    setHasPromptedPremium,
    getCurrentUser,
    nutriPoints,
    coinAnimation,
    setCoinAnimation,
  } = useContext(userDataContext);

  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🟢 NEW: Mobile sidebar toggle switch tracking
  const navigate = useNavigate();
  const location = useLocation();

  //images of the coin

  const coinFront =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/coinFront_y4qgvs.png";

  const coinBack =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/coinBack_wcnpb3.png";

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
        setHasPromptedPremium(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [userData, hasPromptedPremium]);

  useEffect(() => {
    if (!userData) {
      getCurrentUser();
    }
  }, []);

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

  const currentActiveIndex = menuItems.findIndex(
    (item) =>
      item.path === location.pathname ||
      (location.pathname === "/dashboard/" && item.path === "/dashboard"),
  );

  const handlePrevSection = () => {
    const prevIndex =
      (currentActiveIndex - 1 + menuItems.length) % menuItems.length;
    navigate(menuItems[prevIndex].path);
  };

  const handleNextSection = () => {
    const nextIndex = (currentActiveIndex + 1) % menuItems.length;
    navigate(menuItems[nextIndex].path);
  };

  const getActiveLabel = () => {
    const currentItem = menuItems.find(
      (item) =>
        item.path === location.pathname ||
        (location.pathname === "/dashboard/" && item.path === "/dashboard"),
    );
    return currentItem ? currentItem.label : "Dashboard";
  };

  useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  return (
    <div className="h-screen w-full bg-[#A6D4AC]/40 dark:bg-[#060a07] flex overflow-hidden transition-colors duration-300 relative">
      {userData && !userData.profileCompleted && <ProfileSetup />}

      {/* 🟢 NEW: Adaptive Dimming Backdrop overlay mask on mobile screens */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Stays fixed on desktop, transforms to a slide-out drawer layout on mobile/tablets */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-[#0c130d] shadow-xl flex flex-col z-50 md:z-20 flex-shrink-0 border-r border-transparent dark:border-green-950/10 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-gray-100 dark:border-green-950/20 flex items-center justify-between">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
              setLoading(true);
              setIsSidebarOpen(false); // Close mobile tray on click
            }}
          >
            <span className="text-green-500">Nutri</span>
            <span className="text-yellow-500">Care</span>
          </h1>

          {/* 🟢 NEW: Mobile close interaction button indicator */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links Container */}
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
                  if (location.pathname !== item.path) {
                    navigate(item.path);
                  }
                  setIsSidebarOpen(false); // 🟢 NEW: Drop tray view upon section changes
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

        {/* Sidebar Mini User Profile Footer Card */}
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
      </aside>

      {/* Main Layout Wrapper */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex flex-col min-w-0 md:min-w-max min-h-full">
          {/* Top Header navbar section */}
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white dark:bg-[#0c130d] shadow-md dark:shadow-black/20 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-10 w-full border-b border-transparent dark:border-green-950/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-2 sm:gap-6 min-w-0">
              {/* 🟢 NEW: Floating Hamburger Action Toggle Button. Only visible on mobile/tablets */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:text-green-500 dark:text-zinc-400 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800/40 cursor-pointer transition-colors shrink-0"
                title="Open Sidebar"
              >
                <Menu className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Sequential Row Chevrons */}
              <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-zinc-800/40 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-lg cursor-pointer transition-colors shadow-xs"
                  title="Previous Section"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-lg cursor-pointer transition-colors shadow-xs"
                  title="Next Section"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Component Section Labels Group */}
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight truncate">
                  {getActiveLabel()}
                </h2>
                <div className="text-[10px] sm:text-sm font-medium text-gray-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
                  <span className="hidden sm:inline">Welcome back,</span>
                  <span className="font-extrabold text-gray-700 dark:text-zinc-300 truncate">
                    {userData?.name?.split(" ")[0] || "User"}!
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Icons Metric Pill Clusters Container */}
            <motion.div
              initial={{ x: 150, opacity: 1, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.8, scale: 1 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="flex items-center gap-2 sm:gap-3.5 shrink-0"
            >
              {/* Wallet Display Badge Section */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/pricing")}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-xs select-none"
                title="Your Nutri-Nuggets Wallet balance. Click to redeem for Premium discounts!"
              >
                <div
                  className="w-5 h-5 sm:w-7 h-7 relative shrink-0"
                  style={{ perspective: 400 }}
                >
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{
                      duration: 4,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    className="w-full h-full relative"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front Badge Face */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-full overflow-hidden filter drop-shadow-[0_1px_3px_rgba(212,163,89,0.3)]"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={coinFront}
                        alt="Coin Front"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Back Badge Face */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-full overflow-hidden filter drop-shadow-[0_1px_3px_rgba(212,163,89,0.3)]"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <img
                        src={coinBack}
                        alt="Coin Back"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>
                </div>
                <span>
                  {nutriPoints}
                  <span className="hidden sm:inline"> pts</span>
                  <span className="sm:hidden">p</span>
                </span>
              </motion.div>

              {/* Theme Toggle Trigger */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                type="button"
                className="p-2 sm:p-2.5 bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 border border-gray-200/60 dark:border-zinc-800 rounded-xl cursor-pointer transition-all shadow-xs shrink-0"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 h-4" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 h-4" />
                )}
              </motion.button>

              {/* Premium Status Pill Row */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => !userData?.isPremium && navigate("/pricing")}
                className={`flex items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-[10px] sm:text-xs shadow-sm cursor-pointer transition-colors shrink-0 ${
                  userData?.isPremium
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border border-yellow-300"
                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 border border-gray-300 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {userData?.isPremium ? "🏆 Premium" : "Upgrade"}
              </motion.div>

              {/* Branding Image Icon */}
              <img
                src={NutriCareLogo}
                alt="NutriCare Logo"
                className="hidden sm:block rounded-full h-12 w-14 object-cover object-center border border-gray-100 dark:border-zinc-800/80 shadow-xs shrink-0"
              />
            </motion.div>
          </motion.header>

          {/* Dynamic Nested Sub-Page View Rendering Outlet Content Layout Panel Area */}
          <main className="p-4 sm:p-8 flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      {/* PREMIUM UPGRADE POPUP */}
      <AnimatePresence>
        {showPremiumPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-6 border-l-4 border-yellow-400 dark:border-yellow-500 max-w-sm border border-transparent dark:border-zinc-800/80 w-[calc(100%-32px)] sm:w-full"
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

      <EarningCoinPopup
        animationState={coinAnimation}
        onClose={() => setCoinAnimation({ show: false, points: 0 })}
      />
    </div>
  );
}
