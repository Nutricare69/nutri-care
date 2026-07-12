import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ExternalLink,
  Sparkles,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify"; // 🟢 NEW: Imported toast notification engine
import { useTheme } from "../../components/theme.js";

// Explicit Asset Imports using your exact filename strings
import agastyaLogo from "../../assets/NGO's/agastyaInternationalFoundationLogo.avif";
import shuddhiLogo from "../../assets/NGO's/shuddhiLogo.avif";
import dreamsLogo from "../../assets/NGO's/dreamsForLifeLogo.png";
import sevaLogo from "../../assets/NGO's/sevaFoundationLogo.jpg";
import noahsArkLogo from "../../assets/NGO's/noahsarklogo.png";

export default function NgoSupport() {
  const { isDark } = useTheme();
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // 🟢 NEW: Active link validation layer

  // 🟢 NEW: Listen to live hardware connection adjustments while sitting on the tab
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 🟢 NEW: Intercept link redirects if user tries to jump outward without internet lines
  const handleExternalLinkClick = (e) => {
    if (isOffline) {
      e.preventDefault();
      toast.error(
        "Network connection down. External payment portals require active internet connection routes.",
      );
    }
  };

  const ngoList = [
    {
      name: "Agastya International Foundation",
      logo: agastyaLogo,
      link: "https://www.agastya.org/",
      focus: "Cognitive & STEM Development",
      desc: "Nurturing young minds through experiential education, proving that proper youth nutrition and active learning build a brighter future.",
    },
    {
      name: "Shuddhi",
      logo: shuddhiLogo,
      link: "https://help.shuddhi.org/support",
      focus: "Water Sanitation & Hygiene",
      desc: "Deploying clean water filtration systems across rural communities, securing the foundational clean baseline required for metabolic health.",
    },
    {
      name: "Dreams For Life",
      logo: dreamsLogo,
      link: "https://dflwf.com/",
      focus: "Child Nutrition & Welfare",
      desc: "Directly executing grassroots nutrition distribution drives, child literacy programs, and essential health resources for underprivileged youth.",
    },
    {
      name: "Seva Foundation",
      logo: sevaLogo,
      link: "https://www.seva.org/",
      focus: "Preventative Eye Nutrition",
      desc: "Combatting avoidable blindness through sight-restoring medical procedures and vital Vitamin A nutritional distribution programs globally.",
    },
    {
      name: "Noah's Ark",
      logo: noahsArkLogo,
      link: "https://www.noahsark.org.in/",
      focus: "Therapeutic Health & Welfare",
      desc: "Providing free specialized care, physical therapies, and customized metabolic welfare assistance for specially-abled children.",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ngo-premium"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className="space-y-10 max-w-[1600px] mx-auto px-1"
      >
        {/* Main Section Title */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-green-500 rounded-full" />
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Corporate Social Responsibility
          </h3>
        </div>

        {/* 🟢 NEW: Local Sub-Page Workspace Offline View Alert Banner */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3.5 mt-4"
          >
            <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Displaying local NGO profiles. External platform redirection links
              are disabled until internet access scales up.
            </div>
          </motion.div>
        )}

        {/* Premium Core Pledges Announcement Block */}
        <div
          className="relative rounded-[2rem] p-8 sm:p-10 overflow-hidden border border-green-500/20 dark:border-green-500/10 bg-gradient-to-br from-green-500/[0.08] via-emerald-500/[0.03] to-transparent flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
          style={{
            boxShadow: isDark
              ? "0 20px 40px -15px rgba(0,0,0,0.5)"
              : "0 20px 40px -15px rgba(143,169,143,0.15)",
          }}
        >
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400 font-extrabold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              NutriCare Social Initiative
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">
              Fueling Change With{" "}
              <span className="text-green-500 font-black">
                5% Annual Profit Contribution
              </span>
            </h4>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
              We understand true wellness spans beyond our application interface
              boundaries. Every cycle, NutriCare automatically redirects a solid
              fraction of its commercial proceeds to verified charity
              operations. Choose to partner alongside us today with your
              personal, compassionate donations to make a life easy, happy, and
              long.
            </p>
          </div>

          {/* Large Floating Percentage Ring Badge */}
          <div className="shrink-0 bg-white dark:bg-zinc-900 border-4 border-green-500/30 w-32 h-32 rounded-full flex flex-col items-center justify-center text-center shadow-lg transform lg:rotate-6 hover:rotate-0 transition-transform duration-500">
            <span className="text-3xl font-black text-green-500 tracking-tighter">
              5%
            </span>
            <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-black tracking-wider mt-0.5">
              Pledge Gift
            </span>
          </div>
        </div>

        {/* Upscaled Interactive NGO Showcase Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ngoList.map((ngo, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                y: -8,
                scale: 1.02,
                borderColor: isDark
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(34,197,94,0.4)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white dark:bg-[#0c130d] border border-gray-100 dark:border-green-950/20 rounded-[2.25rem] p-8 flex flex-col justify-between relative group overflow-hidden"
              style={{
                boxShadow: isDark
                  ? "0 15px 35px -10px rgba(0,0,0,0.4)"
                  : "0 20px 40px -20px #8fa98f",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-6">
                <div className="w-28 h-28 mx-auto bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={ngo.logo}
                    alt={`${ngo.name} Brand Emblem`}
                    className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Info Hierarchy Block */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/[0.06] text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                    <Building2 className="w-3 h-3" />
                    {ngo.focus}
                  </div>
                  <h4 className="font-black text-lg text-gray-900 dark:text-zinc-100 tracking-tight leading-snug px-1 line-clamp-1">
                    {ngo.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium line-clamp-3 px-2">
                    {ngo.desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100 dark:border-zinc-900/60">
                <motion.a
                  whileTap={{ scale: 0.97 }}
                  href={ngo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleExternalLinkClick} // 🟢 NEW: Integrated link tap intercept logic
                  className={`w-full py-3.5 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all ${
                    isOffline
                      ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white hover:shadow-green-500/10 cursor-pointer"
                  }`}
                >
                  Contribute & Donate
                  {!isOffline && (
                    <ExternalLink className="w-4 h-4 stroke-[2.5] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
