// c:\Users\suvaj\Desktop\NutriCare\Frontend\src\pages\Dashboard\Dashboard.jsx
import React, { useEffect, useContext, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PieChart,
  Users,
  Heart,
  Settings,
} from "lucide-react";
import { userDataContext } from "../../context/UserContext";
import NutriCareLogo from "../../assets/nutricareLogo.jpg";
import Loader from "../../components/Loader";
import ProfileSetup from "../../components/ProfileSetup";

export default function Dashboard() {
  const { userData, getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data on mount
  useEffect(() => {
    if (!userData) {
      getCurrentUser();
    }
  }, []);

  // Sidebar menu items mapped to routes
  const menuItems = [
    { id: "dietplans", icon: LayoutDashboard, label: "Diet Plans", path: "/dashboard" },
    { id: "analytics", icon: PieChart, label: "Analytics", path: "/dashboard/analytics" },
    { id: "community", icon: Users, label: "Community", path: "/dashboard/community" },
    { id: "ngo", icon: Heart, label: "NGO Support", path: "/dashboard/ngo" },
    { id: "settings", icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  // Helper to determine the active header title
  const getActiveLabel = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname || (location.pathname === "/dashboard/" && item.path === "/dashboard")
    );
    return currentItem ? currentItem.label : "Dashboard";
  };

  //useEffect for loading 
  useEffect(() => {
    setLoading(false); 
  }, [location.pathname]);

    return (
      // Outer div stays fixed to screen size, hides its own overflow
      <div className="h-screen w-full bg-[#A6D4AC]/40 flex overflow-hidden">
        {userData && !userData.profileCompleted && <ProfileSetup />}

        {/* Sidebar - stays fixed to the left */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0, delay: 0.5 }}
          className="w-64 bg-white shadow-xl flex flex-col z-20 flex-shrink-0"
        >
          {/* Logo */}
          <div className="p-6 border-b">
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
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* User Info at Bottom */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                {userData?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {userData?.name?.split(" ")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
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
            
            {/* Top Header - now it stretches fully across the expanded scroll area */}
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              className="bg-white shadow-md px-8 py-4 flex items-center justify-between sticky top-0 z-10 w-full"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {getActiveLabel()}
                </h2>
                <div className="text-xl text-gray-500 flex gap-2">
                  Welcome back,{" "}
                  <div className="font-bold">
                    {userData?.name?.split(" ")[0] || "User"}!
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ x: 150, opacity: 1, scale: 0.8 }}
                animate={{ x: 0, opacity: 0.8, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                className="flex items-center gap-4"
              >
                <img
                  src={NutriCareLogo}
                  alt="NutriCare Logo"
                  className="rounded-full h-25 w-30 content-end"
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
      </div>
    );
}