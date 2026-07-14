import React, { useId, useState, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaHouse } from "react-icons/fa6";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";
import { MdPermPhoneMsg } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoIosContacts } from "react-icons/io";
import { Sparkles } from "lucide-react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContextProvider";
import { useTheme } from "../../components/theme.js";

export default function Contact() {
  const { serverUrl } = useContext(authDataContext);
  const { isDark } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  // Animation variants
  const slideUpVariant = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInUpVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideInLeftVariant = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRightVariant = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const zoomInVariant = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const phoneContentContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2, 
      },
    },
  };

  const formContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const scaleInVariant = {
    hidden: { scale: 0.7, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
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

  const id = useId();

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    // Handle form submission logic here
    try {
      const result = await axios.post(
        serverUrl + "/api/contact/feedback",
        {
          name: firstName + " " + lastName,
          email: email,
          phoneNumber: phoneNumber,
          category: category,
          description: description,
        },
        { withCredentials: true }
      );
      console.log(result);
      alert("Feedback submitted successfully!");
      // Clear all fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setCategory("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Feedback submission failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#A6D4AC]/40 dark:bg-[#060f09] text-black dark:text-zinc-100 transition-colors duration-300">
      <Navbar />
      
      {/* Main Wrapper pushing Footer Down */}
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Animated background elements */}
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

          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#0f1d13]/80 dark:border dark:border-green-800/20 backdrop-blur-sm rounded-full mb-6 shadow-md"
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                We're Here to Help You
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-800 dark:text-white"
            >
              Get in <span className="text-green-500">Touch</span> With Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-zinc-300 max-w-3xl mx-auto mb-10"
            >
              Have questions or need support? We're here to assist you on your health journey. Reach out to us anytime!
            </motion.p>
          </div>
        </motion.section>

        {/* Contact Information Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Connect With <span className="text-green-500">NutriCare</span>
              </h2>
              <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                Multiple ways to reach us - choose what works best for you
              </p>
            </motion.div>

            {/* Contact Cards */}
            <motion.div
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20"
            >
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 shadow-xl text-center border border-transparent dark:border-green-800/10"
                style={{
                  boxShadow: isDark ? "4px 4px 16px rgba(0, 0, 0, 0.4)" : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                  <MdMarkEmailRead className="text-4xl text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-green-400">Email Us</h3>
                <p className="text-gray-600 dark:text-zinc-355 break-words">nutricareai@gmail.com</p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 shadow-xl text-center border border-transparent dark:border-green-800/10"
                style={{
                  boxShadow: isDark ? "4px 4px 16px rgba(0, 0, 0, 0.4)" : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                  <MdPermPhoneMsg className="text-4xl text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-green-400">Call Us</h3>
                <p className="text-gray-600 dark:text-zinc-355">+(91) 1800-456-7890</p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl p-8 shadow-xl text-center border border-transparent dark:border-green-800/10"
                style={{
                  boxShadow: isDark ? "4px 4px 16px rgba(0, 0, 0, 0.4)" : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#E8F4F0] dark:bg-green-950/40 rounded-2xl flex items-center justify-center">
                  <FaMapMarkedAlt className="text-4xl text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-green-400">Visit Us</h3>
                <p className="text-gray-600 dark:text-zinc-355">Nishchintapur, Budge Budge, Kolkata-700138</p>
              </motion.div>
            </motion.div>

            {/* Map and Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Map Section */}
              <motion.div
                状况="visible"
                variants={slideInLeftVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-[#0f1d13] rounded-3xl p-4 md:p-6 shadow-xl h-fit border border-transparent dark:border-green-800/15"
                style={{
                  boxShadow: isDark ? "4px 4px 16px rgba(0, 0, 0, 0.4)" : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                }}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                  Find Us Here
                </h3>
                <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: "500px" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d3687.207892434049!2d88.1705648!3d22.4588207!3m2!1i1024!2i768!4f13.1!2m1!1sbbit%20map!5e0!3m2!1sen!2sin!4v1765433629519!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </motion.div>

              {/* Phone Card Form */}
              <motion.div
                variants={slideInRightVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ allow: true, amount: 0.2 }}
                className="flex justify-center items-start"
              >
                <div className="w-full max-w-md">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-4xl bg-black dark:bg-[#0c130d] phone-card-container border border-transparent dark:border-green-950"
                    style={{
                      boxShadow: isDark ? "4px 4px 16px rgba(0, 0, 0, 0.4)" : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
                    }}
                    initial="visible"
                    // whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={slideUpVariant}
                  >
                    <motion.div
                      className="relative py-4 px-2 rounded-t-3xl bg-gradient-to-bl from-[#A6D4AC] via-[#8FBC8F] via-[#98D8C8] to-[#F7D8BA] dark:from-[#09120c] dark:via-[#132318] dark:to-[#172c21] overflow-y-auto"
                      style={{ height: "750px" }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      // variants={phoneContentContainerVariant}
                    >
                      {/* phone content text */}
                      <motion.p
                        className="text-lg sm:text-xl text-white text-center font-bold mb-4 px-2"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        Feel free to reach us through this form
                      </motion.p>
                      
                      <motion.div
                        className="flex justify-center mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <IoIosContacts className="text-6xl sm:text-7xl text-amber-200" />
                      </motion.div>
                      
                      {/* Contact Form */}
                      <motion.form
                        className="px-4 space-y-3"
                        onSubmit={handleFeedbackSubmit}
                      >
                        {/* First Name */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <input
                            type="text"
                            id={id + "firstName"}
                            placeholder="First Name"
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </motion.div>

                        {/* Last Name */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.75 }}
                        >
                          <input
                            type="text"
                            id={id + "lastName"}
                            placeholder="Last Name"
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </motion.div>

                        {/* Email */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.9 }}
                        >
                          <input
                            type="email"
                            id={id + "email"}
                            placeholder="Write your email"
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </motion.div>

                        {/* Mobile Number */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 1.05 }}
                        >
                          <input
                            type="tel"
                            id={id + "mobileNumber"}
                            placeholder="Write your Mobile Number"
                            required
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </motion.div>

                        {/* Category Dropdown */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 1.2 }}
                        >
                          <select
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none"
                            defaultValue=""
                            id={id + "category"}
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="" disabled className="text-gray-500">
                              Select Category
                            </option>
                            <option value="login-issue">Login Issue</option>
                            <option value="response-error">Response Error</option>
                            <option value="wrong-diet-plan">Wrong Diet Plan</option>
                            <option value="other">Other</option>
                          </select>
                        </motion.div>

                        {/* Description Box */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 1.35 }}
                        >
                          <textarea
                            placeholder="Describe your issue in detail..."
                            rows="4"
                            className="w-full px-3 py-2 rounded-lg border-2 border-green-600 dark:border-green-800 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-zinc-100 focus:border-green-700 focus:outline-none resize-none"
                            id={id + "description"}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                          className="flex justify-center pt-2"
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 1.5 }}
                        >
                          <button
                            type="submit"
                            className="px-8 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-100 transition-all duration-300 hover:scale-105"
                          >
                            Submit
                          </button>
                        </motion.div>

                        {/* Reply Time Notice */}
                        <motion.p
                          className="text-center text-sm text-white/90 font-semibold pt-2"
                          initial={{ opacity: 0, y: -20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 1.65 }}
                        >
                          We reply within 24 to 48 hours
                        </motion.p>
                      </motion.form>
                    </motion.div>
                    
                    {/* phone screen buttons */}
                    <motion.div 
                      className="w-full h-15 mt-1 flex justify-around items-center px-4 py-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <FaHouse className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-green-300 transition-colors" />
                      <AiOutlineThunderbolt className="text-3xl sm:text-4xl text-white cursor-pointer hover:text-green-300 transition-colors" />
                      <div className="rounded-full bg-white h-8 w-12 flex justify-center items-center cursor-pointer hover:bg-green-100 transition-colors">
                        <FaPlus className="text-black text-xl" />
                      </div>
                      <MdOutlineMessage className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-green-300 transition-colors" />
                      <AiOutlineUser className="text-2xl sm:text-3xl text-white cursor-pointer hover:text-green-300 transition-colors" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}