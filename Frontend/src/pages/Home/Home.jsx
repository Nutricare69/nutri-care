import React from "react";
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
import ExtraFeatureImage from "../../assets/ExtraFeatureImage.png";
import { motion } from 'framer-motion';

export default function Home() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      {/* Root Container: Forces fullscreen minimum height and pushes footer to bottom */}
      <div className="flex flex-col min-h-screen w-full bg-[#A6D4AC]/40">
        
        {/* Main Content Wrapper - Gets Flex-Grow so it eats up all empty space to pin footer down */}
        <div className="flex-grow flex flex-col items-center w-full pb-10">
          
          <div className="w-full relative">
            <Navbar />
            <Hero />
          </div>
          
          {/* Core Features Section */}
          <div className="w-full max-w-[1400px] px-4 sm:px-6 md:px-8 mt-16 sm:mt-24 md:mt-32">
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-16 text-center"
            >
              Core Features Section
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              /* Added gap-8 md:gap-10 for breathing room between sleek cards */
              className="flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-10 lg:gap-13"
            >
              {/* Feature 1: Diet card - Taller and Sleeker (max-w-[300px] min-h-[400px]) */}
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.05 }} className="relative px-4 py-8 w-full md:w-[22%] min-w-[280px] max-w-[300px] min-h-[400px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center" style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}>
                <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                  <span className="text-[#c7edef] text-lg font-bold">1</span>
                </div>
                <div className="h-32 w-32 sm:h-44 sm:w-44 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                  <img className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]" src={DietIcon} alt="Diet Icon" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mt-8">Personalized Diets</h3>
                <p className="text-base font-medium text-center mt-4">AI-generated meal plans <br /> customized to users</p>
              </motion.div>

              {/* Feature 2: AI Health Analysis - Taller and Sleeker */}
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.05 }} className="relative px-4 py-8 w-full md:w-[22%] min-w-[280px] max-w-[300px] min-h-[400px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center" style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}>
                <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                  <span className="text-[#c7edef] text-lg font-bold">2</span>
                </div>
                <div className="h-32 w-32 sm:h-44 sm:w-44 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                  <img className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]" src={AIHealthIcon} alt="AI Health Icon" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mt-8">AI Health Analysis</h3>
                <p className="text-base font-medium text-center mt-4">Real-time data analysis <br /> for better decisions</p>
              </motion.div>

              {/* Feature 3: Smart Insights - Taller and Sleeker */}
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.05 }} className="relative px-4 py-8 w-full md:w-[22%] min-w-[280px] max-w-[300px] min-h-[400px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center" style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}>
                <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                  <span className="text-[#c7edef] text-lg font-bold">3</span>
                </div>
                <div className="h-32 w-32 sm:h-44 sm:w-44 mt-6 rounded-3xl bg-lime-100/40 flex items-center justify-center relative">
                  <img className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]" src={SmartInsightIcon} alt="Smart Insights Icon" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mt-8">Smart Insights</h3>
                <p className="text-base font-medium text-center mt-4">Track progress and get <br /> improvement suggestions</p>
              </motion.div>

              {/* Feature 4: Social Impact - Taller and Sleeker */}
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.05 }} className="relative px-4 py-8 w-full md:w-[22%] min-w-[280px] max-w-[300px] min-h-[400px] bg-white rounded-3xl border-2 sm:border-4 border-[#c7edef] flex flex-col items-center" style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}>
                <div className="absolute w-8 h-8 right-5 top-5 border-4 border-[#c7edef] rounded-full flex items-center justify-center">
                  <span className="text-[#c7edef] text-lg font-bold">4</span>
                </div>
                <div className="h-32 w-32 sm:h-44 sm:w-44 mt-6 rounded-3xl bg-slate-200/40 flex items-center justify-center relative">
                  <img className="absolute inset-0 m-auto max-w-[80%] max-h-[80%]" src={SocialImpactIcon} alt="Social Impact Icon" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mt-8">Social Impact</h3>
                <p className="text-base font-medium text-center mt-4">Helping communities via <br /> nutrition support programs</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Extra Features / Trust Section */}
          <div className="w-full max-w-[1400px] px-4 sm:px-6 md:px-8 mt-16 sm:mt-32 md:mt-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full bg-[#fefefe] rounded-[2rem] shadow-xl flex flex-col items-center py-10 px-4 md:px-10"
            >
              <motion.h2 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Why Thousands Trust NutriCare AI
              </motion.h2>
              
              <div className="w-full mt-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                <motion.div className="w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-[400px] rounded-3xl">
                  <img style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }} src={ExtraFeatureImage} alt="Extra Feature" className="w-full h-full object-cover rounded-3xl" />
                </motion.div>

                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6">
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 1.03 }} className="w-full min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-4 gap-4 items-center" style={{ boxShadow: "2px 2px 8px #8fa98f" }}>
                    <img src={ScienceBacked} alt="Science-Backed AI Nutrition" className="w-12 md:w-16" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">Science-Backed AI Nutrition</span>
                  </motion.div>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 1.03 }} className="w-full min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-4 gap-4 items-center" style={{ boxShadow: "2px 2px 8px #8fa98f" }}>
                    <img src={ContinuousLearning} alt="Continuous Learning" className="w-12 md:w-16" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">Continuous Learning from Your Data</span>
                  </motion.div>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 1.03 }} className="w-full min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-4 gap-4 items-center" style={{ boxShadow: "2px 2px 8px #8fa98f" }}>
                    <img src={HolisticHealth} alt="Holistic Health" className="w-12 md:w-16" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">Holistic Health Recommendations</span>
                  </motion.div>
                  <motion.div variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 1.03 }} className="w-full min-h-[80px] bg-[#e5f0e0] rounded-2xl flex px-4 gap-4 items-center" style={{ boxShadow: "2px 2px 8px #8fa98f" }}>
                    <img src={CommunityWellness} alt="Community Wellness" className="w-12 md:w-16" />
                    <span className="text-base md:text-lg lg:text-xl font-medium">Community Wellness Approach</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer Area - Placed OUTSIDE the flex-grow to snap to the bottom perfectly */}
        <div className="w-full mt-auto">
          <Footer />
        </div>

      </div>
    </>
  );
}