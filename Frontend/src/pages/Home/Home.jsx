import React, { useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Hero from "../../components/Hero.jsx";
import Footer from "../../components/Footer.jsx";
import SocialImpactIcon from "../../assets/svg/Social Impact.svg";
import AIHealthIcon from "../../assets/svg/AI Health.svg";
import SmartInsightIcon from "../../assets/svg/Smart Insight.svg";
import DietIcon from "../../assets/svg/Diet.svg";
import ScienceBacked from "../../assets/svg/Science-Backed.svg";
import ContinuousLearning from "../../assets/svg/Continuous Learning.svg";
import HolisticHealth from "../../assets/svg/Holistic Health.svg";
import CommunityWellness from "../../assets/svg/Community Wellness.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../components/theme.js";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const ExtraFeatureImage =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/ExtraFeatureImage_vmxl84.png";

  // FIXED: FAQ data matches your site's core mission, layout steps, and history context
  const platformFaqs = [
    {
      q: "What are the key layout milestones for completing my core health profile?",
      a: "Getting set up follows four straightforward stages: First, setting up your core health metrics and profile boundaries. Second, letting our core ML models run an instant breakdown. Third, downloading dynamic menu charts. Finally, checking continuous dashboard insight tracking updates to refine your plan.",
    },
    {
      q: "How does the machine learning integration build my daily menu updates?",
      a: "Our tech structure merges science-backed nutritional targets with specialized data arrays. Instead of simple static tables, the architecture recalculates your dietary charts dynamically based on ongoing logging stats, habit adjustments, and personal milestones.",
    },
    {
      q: "When did NutriCare AI begin its developmental roadmap?",
      a: "Our product path launched with target ideation in May 2025. This was followed by comprehensive planning blocks in July 2025, core algorithmic code building in August 2025, and subsequent beta tracking evaluations before rolling out our production-grade ecosystem.",
    },
    {
      q: "What fundamental design guidelines drive the platform's features?",
      a: "Everything we deploy centers around four key principles: prioritizing your baseline health above all else, ensuring granular personalization for your specific routine, protecting your data through strict privacy layouts, and maintaining constant innovation.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#A6D4AC]/40">
      {/* Main Content Vertical Stack */}
      <div className="grow flex flex-col w-full pb-10 overflow-x-hidden items-center">
        {/* Navbar */}
        <div className="w-full">
          <Navbar />
        </div>

        {/* Hero Section Container */}
        <div className="w-full flex justify-center">
          <Hero />
        </div>

        {/* Core Features Section */}
        <div className="w-full max-w-[2000px] px-4 sm:px-6 md:px-8 mt-16 sm:mt-24 md:mt-32 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-14 text-center px-2"
          >
            Core Features
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12"
          >
            {/* Feature 1 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-4 py-8 w-[85vw] sm:w-[44%] md:w-[22%] min-w-[260px] max-w-[300px] min-h-[380px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center mx-auto sm:mx-0"
              style={{
                boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                <span className="text-[#c7edef] text-lg font-bold">1</span>
              </div>
              <div className="h-32 w-32 sm:h-40 sm:w-40 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                <img
                  className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]"
                  src={DietIcon}
                  alt="Diet Icon"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mt-8">
                Personalized Diets
              </h3>
              <p className="text-base font-medium text-center mt-4 text-gray-600">
                AI-generated meal plans customized to you
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-4 py-8 w-[85vw] sm:w-[44%] md:w-[22%] min-w-[260px] max-w-[300px] min-h-[380px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center mx-auto sm:mx-0"
              style={{
                boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                <span className="text-[#c7edef] text-lg font-bold">2</span>
              </div>
              <div className="h-32 w-32 sm:h-40 sm:w-40 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                <img
                  className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]"
                  src={AIHealthIcon}
                  alt="AI Health Icon"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mt-8">
                AI Health Analysis
              </h3>
              <p className="text-base font-medium text-center mt-4 text-gray-600">
                Real-time data analysis for better decisions
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-4 py-8 w-[85vw] sm:w-[44%] md:w-[22%] min-w-[260px] max-w-[300px] min-h-[380px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center mx-auto sm:mx-0"
              style={{
                boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                <span className="text-[#c7edef] text-lg font-bold">3</span>
              </div>
              <div className="h-32 w-32 sm:h-40 sm:w-40 mt-6 rounded-3xl bg-lime-100/40 flex items-center justify-center relative">
                <img
                  className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]"
                  src={SmartInsightIcon}
                  alt="Smart Insights Icon"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mt-8">
                Smart Insights
              </h3>
              <p className="text-base font-medium text-center mt-4 text-gray-600">
                Track progress and get improvement suggestions
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-4 py-8 w-[85vw] sm:w-[44%] md:w-[22%] min-w-[260px] max-w-[300px] min-h-[380px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center mx-auto sm:mx-0"
              style={{
                boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                <span className="text-[#c7edef] text-lg font-bold">4</span>
              </div>
              <div className="h-32 w-32 sm:h-40 sm:w-40 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                <img
                  className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]"
                  src={SocialImpactIcon}
                  alt="Social Impact Icon"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mt-8">
                Social Impact
              </h3>
              <p className="text-base font-medium text-center mt-4 text-gray-600">
                Helping communities via nutrition support programs
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Extra Features / Trust Section */}
        <div className="w-full max-w-[2000px] px-4 sm:px-6 md:px-8 mt-12 sm:mt-24 md:mt-32 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#fefefe] rounded-[2rem] shadow-xl flex flex-col items-center py-8 sm:py-10 px-4 sm:px-6 md:px-10"
          >
            <motion.h2 className="text-center font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl px-2">
              Why Thousands Trust NutriCare AI
            </motion.h2>

            <div className="w-full mt-8 sm:mt-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <motion.div className="w-full lg:w-1/2 h-[220px] sm:h-[300px] lg:h-[400px] rounded-3xl overflow-hidden flex-shrink-0">
                <img
                  style={{
                    boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                  }}
                  src={ExtraFeatureImage}
                  alt="Extra Feature"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4 md:gap-6"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[70px] sm:min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-3 sm:px-4 gap-3 sm:gap-4 items-center"
                  style={{ boxShadow: "2px 2px 8px #8fa98f" }}
                >
                  <img
                    src={ScienceBacked}
                    alt="Science-Backed"
                    className="w-10 sm:w-12 md:w-16 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    Science-Backed AI Nutrition
                  </span>
                </motion.div>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[70px] sm:min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-3 sm:px-4 gap-3 sm:gap-4 items-center"
                  style={{ boxShadow: "2px 2px 8px #8fa98f" }}
                >
                  <img
                    src={ContinuousLearning}
                    alt="Continuous Learning"
                    className="w-10 sm:w-12 md:w-16 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    Continuous Learning from Your Data
                  </span>
                </motion.div>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[70px] sm:min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-3 sm:px-4 gap-3 sm:gap-4 items-center"
                  style={{ boxShadow: "2px 2px 8px #8fa98f" }}
                >
                  <img
                    src={HolisticHealth}
                    alt="Holistic Health"
                    className="w-10 sm:w-12 md:w-16 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    Holistic Health Recommendations
                  </span>
                </motion.div>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[70px] sm:min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-3 sm:px-4 gap-3 sm:gap-4 items-center"
                  style={{ boxShadow: "2px 2px 8px #8fa98f" }}
                >
                  <img
                    src={CommunityWellness}
                    alt="Community Wellness"
                    className="w-10 sm:w-12 md:w-16 flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                    Community Wellness Approach
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FIXED: Removed pricing tier section. Left only the updated site context FAQ section */}
        <div className="w-full max-w-[2000px] px-4 sm:px-6 md:px-8 mt-16 sm:mt-24 md:mt-32 mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center px-2"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="max-w-3xl mx-auto flex flex-col gap-4 w-full px-2">
            {platformFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100"
                style={{ boxShadow: "2px 2px 10px rgba(143, 169, 143, 0.1)" }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-base sm:text-lg text-gray-800 focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl text-green-600 transition duration-300">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-50/50 pt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
