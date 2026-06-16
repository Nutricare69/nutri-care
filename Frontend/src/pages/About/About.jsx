import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Sparkles,
  Lightbulb,
  Code,
  Rocket,
  Award,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ArnabImg from "../../assets/team/ArnabJana.jpg";
import KaustubhImg from "../../assets/team/kaustubhPaul.jpeg";
import SuvajitImg from "../../assets/team/SuvajitRoy.jpg";
import RajaniImg from "../../assets/team/RajaniGiri.jpeg";
import SambitImg from "../../assets/team/SambitMondal.jpg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/theme.js";
import { userDataContext } from "../../context/UserContext"; // 🟢 Added context import

export default function About() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { userData } = useContext(userDataContext); // 🟢 Consume userData state

  const team = [
    {
      name: "Arnab Jana",
      role: "Project Lead, ML Model Developer ",
      image: ArnabImg,
    },
    {
      name: "Kaustubh Paul",
      role: "Project Planning, Coordinator, FullStack",
      image: KaustubhImg,
    },
    {
      name: "Suvajit Roy",
      role: "Technical Lead, Full Stack & ML Integration ",
      image: SuvajitImg,
    },
    {
      name: "Rajani Giri",
      role: "Designing Lead, UI/UX Design Generation",
      image: RajaniImg,
    },
    {
      name: "Sambit Mondal",
      role: "Documentation Lead & UI/UX Designer",
      image: SambitImg,
    },
  ];

  const timeline = [
    {
      month: "May 2025",
      title: "Idea Generation",
      description:
        "The spark of innovation - conceived the vision of AI-powered personalized nutrition to transform lives and make health accessible to everyone.",
      icon: Lightbulb,
      color: "#10B981",
    },
    {
      month: "July 2025",
      title: "Research & Planning",
      description:
        "Conducted extensive market research, gathered insights from nutrition experts, and designed the core architecture for our AI system.",
      icon: Target,
      color: "#8B5CF6",
    },
    {
      month: "August 2025",
      title: "Development Phase",
      description:
        "Built the foundation with cutting-edge technology. Developed AI algorithms, user interface, and integrated machine learning models.",
      icon: Code,
      color: "#F59E0B",
    },
    {
      month: "To be announced",
      title: "Beta Testing",
      description:
        "Launched beta version with select users. Gathered feedback, refined features, and optimized the user experience based on real-world usage.",
      icon: Users,
      color: "#EF4444",
    },
    {
      month: "To be announced",
      title: "Platform Launch",
      description:
        "Official launch of NutriCare AI platform. Introduced personalized meal plans, AI health analysis, and real-time tracking features.",
      icon: Rocket,
      color: "#06B6D4",
    },
    {
      month: "To be announced",
      title: "Production Ready",
      description:
        "Achieved full production deployment with 10,000+ active users. Recognized for innovation in health-tech and personalized nutrition.",
      icon: Award,
      color: "#EC4899",
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Health First",
      description:
        "We prioritize your health and well-being above everything else.",
    },
    {
      icon: Users,
      title: "Personalization",
      description:
        "Every individual is unique, and so should be their nutrition plan.",
    },
    {
      icon: Shield,
      title: "Trust & Privacy",
      description: "Your data is secure and your privacy is our top priority.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "We continuously innovate to provide cutting-edge solutions.",
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

  return (
    <div className="w-full h-full bg-[#A6D4AC]/40 dark:bg-[#060f09] text-black dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
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
          className="absolute top-20 right-10 w-64 h-64 bg-green-200/30 dark:bg-green-800/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-200/30 dark:bg-yellow-800/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-green-950/40 backdrop-blur-sm rounded-full mb-6 shadow-md border border-transparent dark:border-green-800/30"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
              Transforming Lives Through Nutrition
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-800 dark:text-white"
          >
            We, <span className="text-green-500">Nutri</span>
            <span className="text-yellow-500">Care</span> AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-zinc-300 max-w-3xl mx-auto mb-10"
          >
            We're on a mission to transform lives through personalized
            nutrition, combining expert knowledge with cutting-edge AI
            technology to help you achieve your health goals.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Purpose & <span className="text-green-500">Direction</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              Guided by a clear mission and inspired by a bold vision for the
              future
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 md:p-10 shadow-xl border border-transparent dark:border-green-800/20"
              style={{
                boxShadow: isDark
                  ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                  : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="w-16 h-16 mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-[#10B981]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-zinc-300 text-lg leading-relaxed">
                To empower individuals with personalized nutrition solutions
                that are accessible, science-backed, and tailored to their
                unique needs. We believe everyone deserves a path to better
                health that fits their lifestyle and goals.
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 md:p-10 shadow-xl border border-transparent dark:border-green-800/20"
              style={{
                boxShadow: isDark
                  ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                  : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <div className="w-16 h-16 mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#10B981]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-zinc-300 text-lg leading-relaxed">
                To become the world's most trusted platform for personalized
                nutrition, where AI and human expertise work together to create
                a healthier future for all. We envision a world where optimal
                health is within everyone's reach.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
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
              Our Core <span className="text-green-500">Values</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              These principles guide everything we do and shape our commitment
              to you.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreValues.map((value, index) => (
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
                  <value.icon
                    className="w-8 h-8 text-[#10B981]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-green-400">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Development <span className="text-green-500">Journey</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              From idea to production - Follow our 12-month journey of
              innovation and growth
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 dark:from-green-950 via-green-400 dark:via-green-700 to-green-200 dark:to-green-950 transform -translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-12 items-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full lg:w-5/12 bg-white dark:bg-[#0f1d13] rounded-3xl p-8 shadow-xl border border-transparent dark:border-green-800/10"
                    style={{
                      boxShadow: isDark
                        ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                        : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                    }}
                  >
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-semibold rounded-full mb-4">
                      {item.month}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-green-400">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-zinc-350 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:flex w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl z-10"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 10px 30px ${item.color}40`,
                    }}
                  >
                    <item.icon
                      className="w-10 h-10 text-white"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <div className="hidden lg:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="text-green-500">Expert Team</span>
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
              Our passionate team of nutrition experts and health professionals
              dedicated to your success
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 "
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl overflow-hidden shadow-lg border border-transparent dark:border-green-800/10"
                style={{
                  boxShadow: isDark
                    ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
                    : "2px 2px 12px #8fa98f",
                }}
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#121f14]">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950 dark:to-green-900"><Users class="w-20 h-20 text-green-500" /></div>`;
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 font-semibold">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dynamic CTA Section */}
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
              Ready to Start Your Health Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of people who have transformed their lives with
              NutriCare's personalized nutrition plans
            </motion.p>

            {/* 🟢 Dynamic Authentication Button Layer */}
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
                : "Get Started Today"}
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
