import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ExternalLink,
  Sparkles,
  Building2,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Activity,
  Users,
  Droplet,
  TrendingUp,
  CloudLightning,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify"; // NEW: Imported toast notification engine
import { useTheme } from "../../components/theme.js";
import { userDataContext } from "../../context/UserContext"; // Implied workspace context

// Unified Asset Imports matching your exact filename structures
import agastyaLogo from "../../assets/NGO's/agastyaInternationalFoundationLogo.avif";
import shuddhiLogo from "../../assets/NGO's/shuddhiLogo.avif";
import dreamsLogo from "../../assets/NGO's/dreamsForLifeLogo.png";
import sevaLogo from "../../assets/NGO's/sevaFoundationLogo.jpg";
import noahsArkLogo from "../../assets/NGO's/noahsarklogo.png";
import unicefLogo from "../../assets/NGO's/unicefLogo.png";

export default function NgoSupport() {
  const { isDark } = useTheme();
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // NEW: Active link validation layer

  // Listen to live hardware connection adjustments while sitting on the tab
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

  // Intercept link redirects if user tries to jump outward without internet lines
  const handleExternalLinkClick = (e) => {
    if (isOffline) {
      e.preventDefault();
      toast.error(
        "Network connection down. External payment portals require active internet connection routes.",
      );
    }
  };

  // Structured alignment alongside the 7 core UNICEF child welfare focus criteria domains
  const unicefDomains = [
    {
      id: "child-protection",
      label: "Child Protection",
      icon: ShieldAlert,
      alloc: "1%",
    },
    { id: "education", label: "Education", icon: GraduationCap, alloc: "1%" },
    {
      id: "health-nutrition",
      label: "Health & Nutrition",
      icon: Activity,
      alloc: "1%",
    },
    {
      id: "gender-equality",
      label: "Gender Equality",
      icon: Users,
      alloc: "1%",
    },
    { id: "wash", label: "WASH (Water & Hygiene)", icon: Droplet, alloc: "1%" },
    {
      id: "social-policy",
      label: "Economic & Social Policy",
      icon: TrendingUp,
      alloc: "1%",
    },
    {
      id: "climate-change",
      label: "Climate & Environment",
      icon: CloudLightning,
      alloc: "1%",
    },
  ];

  const ngoList = [
    {
      name: "Agastya International Foundation",
      logo: agastyaLogo,
      link: "https://www.agastya.org/",
      focus: "Education",
      domainId: "education",
      desc: "Nurturing young minds through experiential STEM education, proving that proper youth nutrition and active cognitive learning build a brighter future.",
    },
    {
      name: "Shuddhi",
      logo: shuddhiLogo,
      link: "https://help.shuddhi.org/support",
      focus: "WASH (Water & Hygiene)",
      domainId: "wash",
      desc: "Deploying clean water filtration systems across rural communities, securing the foundational clean baseline required for metabolic health.",
    },
    {
      name: "Dreams For Life",
      logo: dreamsLogo,
      link: "https://dflwf.com/",
      focus: "Health & Nutrition",
      domainId: "health-nutrition",
      desc: "Directly executing grassroots nutrition distribution drives, child literacy programs, and essential health resources for underprivileged youth.",
    },
    {
      name: "Seva Foundation",
      logo: sevaLogo,
      link: "https://www.seva.org/",
      focus: "Health & Nutrition",
      domainId: "health-nutrition",
      desc: "Combatting avoidable blindness through sight-restoring medical procedures and vital Vitamin A nutritional distribution programs globally.",
    },
    {
      name: "Noah's Ark",
      logo: noahsArkLogo,
      link: "https://www.noahsark.org.in/",
      focus: "Child Protection",
      domainId: "child-protection",
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

        {/* Local Sub-Page Workspace Offline View Alert Banner */}
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
              Offline mode active. Connect to the internet to visit these NGO
              websites!
            </div>
          </motion.div>
        )}

        {/* Premium Core Pledges Announcement Block */}
        <div
          className="relative rounded-[2rem] p-8 sm:p-10 overflow-hidden border border-green-500/20 dark:border-green-500/10 bg-gradient-to-br from-green-500/[0.08] via-emerald-500/[0.03] to-transparent flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10"
          style={{
            boxShadow: isDark
              ? "0 20px 40px -15px rgba(0,0,0,0.5)"
              : "0 20px 40px -15px rgba(143,169,143,0.15)",
          }}
        >
          <div className="space-y-4 max-w-3xl flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400 font-extrabold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              NutriCare Social Initiative
            </div>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">
              Fueling Change With{" "}
              <span className="text-green-500 font-black">
                7% Total Annual Profit Allocation
              </span>
            </h4>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
              We understand true wellness spans beyond our application interface
              boundaries. NutriCare automatically redirects exactly 1% of its
              annual platform proceeds to each of the 7 foundational social
              development categories outlined by UNICEF. Our framework ensures
              that every precision diet plan compiled directly reinforces global
              humanitarian efforts, supporting programmatic change where
              communities need it most.
            </p>
          </div>

          {/* Upgraded Placement Layout Block containing the Profit Ring and UNICEF interactive portal targets */}
          <div className="shrink-0 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-6 w-full lg:w-auto p-4 lg:p-0 bg-gray-50/50 dark:bg-zinc-900/40 lg:bg-transparent rounded-2xl">
            <div className="bg-white dark:bg-zinc-900 border-4 border-green-500/30 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-center shadow-lg transform lg:rotate-6 hover:rotate-0 transition-transform duration-500">
              <span className="text-3xl sm:text-4xl font-black text-green-500 tracking-tighter">
                7%
              </span>
              <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-black tracking-wider mt-0.5">
                Total Pledge
              </span>
            </div>

            {/* NEW DESIGNED ELEMENT: Integrated UNICEF Interactive Goal Verification Card Room */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center px-4 py-1">
                <img
                  src={unicefLogo}
                  alt="UNICEF SDG Alignment Framework Logo"
                  className="h-14 sm:h-16 w-auto object-contain select-none transition-all duration-300 filter drop-shadow-[0_2px_10px_rgba(28,166,233,0.2)] dark:drop-shadow-[0_0_15px_rgba(28,166,233,0.35)]"
                />
              </div>

              <motion.a
                whileHover={!isOffline ? { scale: 1.03 } : {}}
                whileTap={!isOffline ? { scale: 0.98 } : {}}
                href="https://www.unicef.org/sustainable-development-goals"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold tracking-tight transition-all uppercase whitespace-nowrap shadow-xs ${
                  isOffline
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-700/50 cursor-not-allowed"
                    : "bg-white dark:bg-[#0c130d] text-sky-500 dark:text-sky-400 border-sky-400/20 dark:border-sky-500/10 hover:border-sky-400"
                }`}
              >
                <Globe className="w-3 h-3 text-sky-500" />
                Verify UNICEF Goals
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Dynamic Horizontal Pillar Grid Tracking System */}
        <div className="space-y-4">
          <h5 className="font-bold text-xs text-gray-400 dark:text-zinc-500 tracking-wider uppercase flex items-center gap-1.5 ml-1">
            <Sparkles className="w-4 h-4 text-green-500" /> Strategic UNICEF SDG (Sustainable Development Goals)
            Allocation Matrices (1% Per Sector)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {unicefDomains.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <div
                  key={domain.id}
                  className="p-4 bg-gray-50/50 dark:bg-zinc-900/20 border border-gray-100 dark:border-zinc-800/40 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group hover:border-green-500/20 transition-all duration-300"
                >
                  <div className="p-2.5 bg-white dark:bg-[#0c130d] border border-gray-100 dark:border-zinc-800/60 text-green-500 rounded-xl group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 tracking-tight leading-tight">
                    {domain.label}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md mt-1">
                    {domain.alloc} Share
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upscaled Interactive NGO Showcase Grid Container */}
        <div className="space-y-4">
          <h5 className="font-bold text-xs text-gray-400 dark:text-zinc-500 tracking-wider uppercase flex items-center gap-1.5 ml-1">
            <Building2 className="w-4 h-4 text-green-500" /> Partner Vetting
            Registry & Local Activations
          </h5>
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
                      UNICEF SDG Pillar: {ngo.focus}
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
                    onClick={handleExternalLinkClick} // Integrated link tap intercept logic
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
