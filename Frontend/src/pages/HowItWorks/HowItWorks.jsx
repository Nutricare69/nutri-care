import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  Utensils,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Activity,
  Users,
  Brain,
  Heart,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/theme.js";
import { userDataContext } from "../../context/UserContext";

export default function HowItWorks() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const { isDark } = useTheme();
  const { userData } = useContext(userDataContext);
  //images and video assessts linkks

  const profileImg =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/createYourProfile_adtwdv.jpg";
  const aiAnalysisVideo =
    "https://res.cloudinary.com/ddkgrqekv/video/upload/aiAnalysis_mmz44g.mp4";
  const mealPlansImg =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/getYourMealPlan_gavorc.jpg";
  const TrackingVideo =
    "https://res.cloudinary.com/ddkgrqekv/video/upload/track_Evolve_wjwhmf.mp4";
  const demoVideo =
    "https://res.cloudinary.com/ddkgrqekv/video/upload/howitWorks_lr9kky.mp4";


  const handleVideoToggle = () => {
    const video = document.getElementById("demo-video");
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const steps = [
    {
      number: "01",
      icon: UserCircle,
      title: "Create Your Profile",
      description:
        "Share your health goals, dietary preferences, allergies, and lifestyle information with our intelligent AI system.",
      details: [
        "Enter your personal health metrics",
        "Set your dietary preferences",
        "Define your wellness goals",
      ],
      color: "#10B981",
      bgColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#E8F4F0",
      image: profileImg,
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes your data using machine learning algorithms to understand your unique nutritional needs.",
      details: [
        "Real-time data processing",
        "Personalized recommendations",
        "Science-backed insights",
      ],
      color: "#8B5CF6",
      bgColor: isDark ? "rgba(139, 92, 246, 0.15)" : "#F3E8FF",
      video: aiAnalysisVideo,
    },
    {
      number: "03",
      icon: Utensils,
      title: "Get Your Meal Plans",
      description:
        "Receive customized meal recommendations with detailed recipes, nutritional information, and shopping lists.",
      details: [
        "Daily meal plans",
        "Step-by-step recipes",
        "Smart shopping lists",
      ],
      color: "#F59E0B",
      bgColor: isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7",
      image: mealPlansImg,
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Track & Evolve",
      description:
        "Monitor your health journey and get continuous insights with automatic adjustments based on your progress.",
      details: [
        "Progress tracking dashboard",
        "Weekly health reports",
        "Adaptive meal plans",
      ],
      color: "#EF4444",
      bgColor: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
      video: TrackingVideo,
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Precision Nutrition",
      description: "AI-powered meal plans tailored to your unique needs",
    },
    {
      icon: Activity,
      title: "Real-Time Tracking",
      description: "Monitor your progress with advanced analytics",
    },
    {
      icon: Heart,
      title: "Health First",
      description: "Science-backed recommendations for optimal wellness",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join thousands on their nutrition journey",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const floatAnimation = {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="w-full h-full bg-[#A6D4AC]/40 dark:bg-[#060f09] text-black dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden "
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#0f1d13]/80 dark:border dark:border-green-800/20 backdrop-blur-sm rounded-full mb-6 shadow-md text-gray-700 dark:text-zinc-200"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold">
              Your Journey to Better Health Starts Here
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-800 dark:text-white"
          >
            How <span className="text-green-500">Nutri</span>
            <span className="text-yellow-500">Care</span> Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-zinc-350 max-w-3xl mx-auto mb-10"
          >
            Transform your nutrition journey with our AI-powered platform in
            four simple steps
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#10B981] text-white text-lg font-semibold rounded-full hover:bg-[#059669] transition-colors duration-300 shadow-lg flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (userData) {
                  navigate("/dashboard");
                } else {
                  navigate("/signup");
                }
              }}
            >
              {userData
                ? userData.profileCompleted
                  ? `Welcome Back, ${userData.name.split(" ")[0]}!`
                  : "Complete Your Profile"
                : "Get Started Now"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/80 dark:bg-[#0c130d]/80 text-gray-800 dark:text-zinc-200 border border-transparent dark:border-green-800/20 backdrop-blur-sm text-lg font-semibold rounded-full hover:bg-white dark:hover:bg-zinc-900 transition-colors duration-300 shadow-lg cursor-pointer"
              onClick={() => {
                const element = document.getElementById("action-demo-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Watch Demo Video
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Your Path to <span className="text-green-500">Wellness</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              Follow these simple steps to unlock personalized nutrition and
              achieve your health goals
            </p>
          </motion.div>

          {/* Timeline Cards Container */}
          <div className="relative space-y-20 lg:space-y-32 mt-8">
            {/* 
              🟢 FIXED: Vertical Tracking Backbone Line. 
              Anchored relative to this inner container, it initiates exactly under the subtitle 
              and maps a direct route straight through the center grid row splits.
            */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-24 w-1 bg-gradient-to-b from-green-500 via-emerald-400 to-transparent transform -translate-x-1/2 z-0" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } justify-between gap-8 lg:gap-0 items-center relative w-full z-10`}
              >
                {/* 
                  🟢 FIXED: Centered Desktop Tracking Node Marker.
                  Anchored directly on the center string grid dividing row. Contains floating bounce physics.
                */}
                <motion.div
                  animate={floatAnimation}
                  className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl items-center justify-center shadow-xl z-30 transform rotate-12 text-white text-xl font-black select-none"
                >
                  <span className="transform -rotate-12">{step.number}</span>
                </motion.div>

                {/* Step Info Content Box */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full lg:w-[calc(50%-4rem)] bg-white dark:bg-[#0f1d13] rounded-3xl p-8 md:p-10 shadow-xl border border-transparent dark:border-green-800/20 text-gray-800 dark:text-zinc-100"
                  style={{
                    boxShadow: isDark
                      ? "4px 4px 16 rgba(0, 0, 0, 0.4)"
                      : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                  }}
                >
                  {/* Adaptive Corner Mobile Number Badge (Hidden on Large Widescreens) */}
                  <div className="lg:hidden absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md transform rotate-6 z-10 text-white font-bold text-lg select-none">
                    {step.number}
                  </div>

                  <div
                    className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: step.bgColor }}
                  >
                    <step.icon
                      className="w-10 h-10"
                      style={{ color: step.color }}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-green-400">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-350 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <div className="flex items-center gap-3" key={idx}>
                        <CheckCircle2
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          strokeWidth={2}
                        />
                        <span className="text-gray-700 dark:text-zinc-300">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Step Media Assets Box Container */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full lg:w-[calc(50%-4rem)] h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl z-10"
                  style={{
                    boxShadow: isDark
                      ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                      : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                  }}
                >
                  {step.image ? (
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : step.video ? (
                    <video
                      src={step.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute w-64 h-64 border-4 border-white/20 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute w-48 h-48 border-4 border-white/30 rounded-full"
                      />
                      <step.icon
                        className="w-32 h-32 relative z-10"
                        style={{ color: step.color }}
                        strokeWidth={1}
                      />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-zinc-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Why Choose <span className="text-green-500">Nutri</span>
              <span className="text-yellow-500">Care</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              Experience the benefits of AI-powered nutrition planning
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 shadow-lg text-center border border-transparent dark:border-green-800/10"
                style={{
                  boxShadow: isDark
                    ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                    : "2px 2px 12px #8fa98f",
                }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                  <benefit.icon
                    className="w-8 h-8 text-[#10B981]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-green-400">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section id="action-demo-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-[#0f1d13] dark:to-[#09151c] rounded-3xl p-8 md:p-12 shadow-2xl border border-transparent dark:border-green-800/10"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                See It In <span className="text-green-500">Action</span>
              </h2>
              <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                Watch how NutriCare transforms your nutrition journey
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              onClick={handleVideoToggle}
            >
              <video
                id="demo-video"
                src={demoVideo}
                className="w-full h-full object-cover"
                muted
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              <div
                className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-blue-500/20 transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-90" : "opacity-100"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-6 bg-green-500 rounded" />
                      <div className="w-1.5 h-6 bg-green-500 rounded" />
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-green-500 border-b-[12px] border-b-transparent ml-1" />
                  )}
                </motion.div>
              </div>

              <div
                className={`absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 rounded-lg p-3 transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoToggle();
                  }}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  {isPlaying ? (
                    <div className="flex gap-1 items-center">
                      <div className="w-1 h-4 bg-white rounded" />
                      <div className="w-1 h-4 bg-white rounded" />
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  )}
                </button>
                <span className="text-white text-sm">
                  {isPlaying ? "Playing" : "Click to play"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Bottom CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of users who have transformed their health with
              NutriCare AI
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-green-600 text-lg font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-xl inline-flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (userData) {
                  navigate("/dashboard");
                } else {
                  navigate("/signup");
                }
              }}
            >
              {userData
                ? userData.profileCompleted
                  ? `Welcome Back, ${userData.name.split(" ")[0]}!`
                  : "Complete Your Profile"
                : "Start Your Free Trial"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
