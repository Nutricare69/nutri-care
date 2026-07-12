import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import nutriCareLogo from "../assets/nutricareLogo.jpg";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import { authDataContext } from "../context/AuthContextProvider";
import { useTheme } from "./theme.js";
import { Sun, Moon, Menu, X } from "lucide-react"; // 🟢 UPDATED: Imported Menu icon

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 🟢 NEW: Mobile menu drawer open state
  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 NEW: Automatically close mobile menu layout on window resize to avoid scaling anomalies
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUserData(null);
      localStorage.removeItem("nutricare_has_session");
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Contact", path: "/contact" },
  ];

  // Animation variants
  const navLinksVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.15 + 0.5,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const logoVariants = {
    hidden: { rotate: -360, opacity: 0, x: -20 },
    visible: {
      scale: 1.0,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const linkHoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: "0%" },
    hover: { width: "100%", transition: { duration: 0.25, ease: "easeInOut" } },
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" relative p-2 sm:p-3 mb-auto md:p-4 top-2 left-2 right-2 mx-3 z-[200] flex justify-between items-center h-auto bg-white/20 dark:bg-black/30 backdrop-blur-xl rounded-full shadow-md shadow-green-300 dark:shadow-green-950/40 text-black dark:text-white transition-colors duration-300"
      >
        {/* Nutri-Care Logo */}
        <motion.div
          className="relative px-1 sm:px-2 md:px-4 flex items-center gap-0.5 sm:gap-1 md:gap-1.5 cursor-pointer select-none"
          onClick={() => navigate("/")}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <motion.span
            className="w-[30px] h-[28px] xs:w-[35px] xs:h-[32px] sm:w-[45px] sm:h-[42px] md:w-[55px] md:h-[50px] bg-green-500 rounded-full inline-block mr-0.5 sm:mr-1 md:mr-2 relative overflow-hidden shrink-0"
            variants={logoVariants}
            animate={{ x: -10 }}
            whileHover={{
              boxShadow: "0px 0px 20px rgba(34, 197, 94, 0.6)",
              transition: { duration: 0.3 },
            }}
          >
            <img
              src={nutriCareLogo}
              alt="Nutri-Care Logo"
              className="absolute inset-0 w-full h-full object-cover rounded-full"
            />
          </motion.span>
          <motion.span
            className="text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-green-500"
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Nutri
          </motion.span>
          <motion.span
            className="text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-yellow-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            -Care
          </motion.span>
        </motion.div>

        {/** Desktop Navbar Links (Hidden on Tablets & Phones) */}
        <div className="hidden lg:flex gap-4 xl:gap-8 2xl:gap-18 text-black/70 dark:text-white/70">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;

            return (
              <motion.span
                key={link.label}
                className={`text-base lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer relative pb-2 block transition-colors duration-200 ${
                  isActive
                    ? "text-green-500 font-extrabold dark:text-green-400"
                    : "text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white font-medium"
                }`}
                onClick={() => navigate(link.path)}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navLinksVariants}
                whileHover="hover"
              >
                <motion.span className="block" variants={linkHoverVariants}>
                  {link.label}
                </motion.span>
                <motion.div
                  className="absolute bottom-1.5 left-0 h-0.5 bg-green-500/40"
                  variants={underlineVariants}
                  initial="hidden"
                  onHoverStart={() => {}}
                />
                {isActive && (
                  <motion.div
                    layoutId="navActiveDot"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.span>
            );
          })}
        </div>

        {/** Navbar Action Buttons Cluster */}
        <div className="px-1 sm:px-2 md:px-4 lg:px-6 xl:px-10 flex gap-1.5 sm:gap-4 text-xs xs:text-sm sm:text-base md:text-lg items-center">
          {/* Theme Switcher Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full cursor-pointer transition-colors text-black/60 hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-slate-700" />
            )}
          </motion.button>

          {!userData ? (
            <>
              <motion.button
                onClick={() => navigate("/login")}
                className="text-gray-600 dark:text-zinc-300 px-1.5 xs:px-2 sm:px-3 md:px-4 py-1 w-auto min-w-[50px] xs:min-w-[60px] sm:min-w-[70px] md:min-w-[80px] rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition duration-300 cursor-pointer text-center"
                custom={0}
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Log In
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                className="bg-green-500 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-white/90 min-w-[60px] xs:min-w-[70px] sm:min-w-[80px] md:min-w-[90px] hover:bg-green-600 dark:hover:bg-green-400 hover:text-white transition duration-300 cursor-pointer text-center"
                custom={1}
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.5)",
                }}
                whileTap="tap"
              >
                Sign Up
              </motion.button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <motion.div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg md:text-xl cursor-pointer hover:bg-amber-600 transition duration-300 shadow-md select-none"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                animate={showDropdown ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {userData?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-lg shadow-lg overflow-hidden z-[300]"
                  >
                    <motion.button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition duration-200 cursor-pointer border-b border-gray-100 dark:border-zinc-800/40"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Dashboard
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm md:text-base text-gray-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/35 hover:text-rose-600 dark:hover:text-rose-400 transition duration-200 cursor-pointer"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 🟢 NEW: Hamburger Toggle Icon Trigger (Only visible on tablets and mobile layouts) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-gray-600 hover:text-green-500 dark:text-zinc-300 dark:hover:text-green-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>

      {/* 🟢 NEW: Full Screen Mobile Nav Drawer Overlay Navigation System */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed inset-x-4 top-20 bg-white/95 dark:bg-[#0c130d]/95 border border-gray-100 dark:border-green-950/30 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-[250] flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/40 pb-3 mb-1">
              <span className="text-xs font-black text-green-500 uppercase tracking-widest select-none">
                Navigation Directory
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(link.path);
                      setIsMobileMenuOpen(false); // Snap shut on route mutation
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? "bg-green-500 text-white shadow-md shadow-green-600/20"
                        : "bg-gray-50/50 text-gray-600 hover:bg-gray-100 hover:text-black dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
