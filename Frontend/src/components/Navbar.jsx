import React, { useContext, useState, useRef, useEffect } from "react";
import nutriCareLogo from "../assets/nutricareLogo.jpg";
import { useNavigate } from "react-router-dom";
import { motion, scale } from "framer-motion";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { authDataContext } from "../context/AuthContextProvider";
import { useTheme } from "./theme.js";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleLogout = async () => {
    try {
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUserData(null);
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
  hidden: { rotate: -360, opacity: 0 ,x:-20},
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
      scale: 1.1,
      color: theme === "dark" ? "#ffffff" : "#000000",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky p-2 sm:p-3 md:p-4 top-0 left-0 w-full z-200 flex justify-between items-center h-auto bg-white/20 dark:bg-black/30 backdrop-blur-xl rounded-full shadow-md shadow-green-300 dark:shadow-green-950/40 text-black dark:text-white"
    >
      {/* Navbar main div */}

      {/* Nutri-Care Logo */}
      <motion.div
        className="relative px-1 sm:px-2 md:px-4 flex items-center gap-0.5 sm:gap-1 md:gap-1.5 cursor-pointer"
        onClick={() => navigate("/")}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <motion.span
          className="w-[30px] h-[28px] xs:w-[35px] xs:h-[32px] sm:w-[45px] sm:h-[42px] md:w-[55px] md:h-[50px] bg-green-500 rounded-full inline-block mr-0.5 sm:mr-1 md:mr-2"
          variants={logoVariants}
          animate={{ x: -10 }}
          whileHover={{
            boxShadow: "0px 0px 20px rgba(34, 197, 94, 0.6)",
            transition: { duration: 0.3 },
          }}
        >
          <motion.img
            src={nutriCareLogo}
            alt="Nutri-Care Logo"
            className="absolute left-0.5 xs:left-1 sm:left-2 md:left-4 w-7 xs:w-[32px] sm:w-10 md:w-12 h-full object-cover rounded-full"
            // animate={{ rotate: 0}}
            // whileHover={{ rotate: 5}} // Changed from -5 to 180
            // transition={{ duration: 0.3 }}
          />
        </motion.span>
        <motion.span
          className="text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-green-500"
          // initial={{ opacity: 0, x: -20 }}
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

      {/** Navbar Links */}
      <div className="hidden lg:flex gap-4 xl:gap-8 2xl:gap-18 text-black/70 dark:text-white/70">
        <motion.span
          className="text-base lg:text-lg xl:text-xl 2xl:text-2xl hover:text-black/90 dark:hover:text-white cursor-pointer relative"
          onClick={() => navigate("/")}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={navLinksVariants}
          whileHover="hover"
        >
          <motion.span variants={linkHoverVariants}>Home</motion.span>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
        <motion.span
          className="text-base lg:text-lg xl:text-xl 2xl:text-2xl hover:text-black/90 dark:hover:text-white cursor-pointer relative"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={navLinksVariants}
          whileHover="hover"
        >
          <motion.span
            variants={linkHoverVariants}
            onClick={() => navigate("/about")}
          >
            About
          </motion.span>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
        <motion.span
          className="text-base lg:text-lg xl:text-xl 2xl:text-2xl hover:text-black/90 dark:hover:text-white cursor-pointer relative"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={navLinksVariants}
          whileHover="hover"
        >
          <motion.span
            variants={linkHoverVariants}
            onClick={() => navigate("/how-it-works")}
          >
            How It Works
          </motion.span>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
        <motion.span
          className="text-base lg:text-lg xl:text-xl 2xl:text-2xl hover:text-black/90 dark:hover:text-white cursor-pointer relative"
          onClick={() => navigate("/contact")}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={navLinksVariants}
          whileHover="hover"
        >
          <motion.span variants={linkHoverVariants}>Contact</motion.span>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </div>

      {/** Navbar Buttons / User Profile */}
      <div className="px-1 sm:px-2 md:px-4 lg:px-6 xl:px-10 flex gap-2 sm:gap-4 text-xs xs:text-sm sm:text-base md:text-lg items-center">
        {/* Theme Switcher Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-full cursor-pointer transition-colors text-black/60 hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-slate-700" />
          )}
        </motion.button>

        {!userData ? (
          // Show Login and Sign Up buttons when no user data
          <>
            <motion.button
              onClick={() => navigate("/login")}
              className="text-black/60 dark:text-white/70 px-1.5 xs:px-2 sm:px-3 md:px-4 py-1 w-auto min-w-[50px] xs:min-w-[60px] sm:min-w-[70px] md:min-w-[80px] rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:text-white/90 dark:hover:text-white transition duration-300 cursor-pointer"
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
              className="bg-green-500 rounded-full px-1.5 xs:px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-white/90 min-w-[60px] xs:min-w-[70px] sm:min-w-[80px] md:min-w-[90px] hover:bg-green-600 dark:hover:bg-green-400 hover:text-black/70 dark:hover:text-zinc-950 transition duration-300 cursor-pointer"
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
          // Show User Profile when user data exists
          <motion.div
            className="relative"
            ref={dropdownRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg md:text-xl cursor-pointer hover:bg-amber-600 transition duration-300 shadow-md"
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
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-lg shadow-lg overflow-hidden z-300"
              >
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
