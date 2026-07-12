import React from "react";
import nutriCareLogo from "../assets/nutricareLogo.jpg";
import { BsCCircle } from "react-icons/bs";
import { GrLinkedinOption } from "react-icons/gr";
import { BsInstagram } from "react-icons/bs";
import { IoLogoTwitter } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: -360,
      transition: { duration: 0.5, type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.9 },
  };
  const navigate = useNavigate();

  return (
    <>
      {/* Footer component content goes here */}

      {/* FIX: Added mt-auto to strictly push the footer to the bottom of the Flex container in Home.jsx */}
      <motion.div
        className="mt-auto relative flex flex-col w-full h-auto min-h-[280px] lg:h-70 rounded-t-2xl justify-center mb-0 items-center bg-[#1d2f21]/80 py-8 lg:py-0 pb-20 lg:pb-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/*Logo and Name*/}
        <div className=" p-5 w-full max-w-[1500px] flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0 ">
          <motion.div
            className=" w-full max-w-[360px] sm:w-90 flex justify-between items-center px-4 py-2 "
            variants={itemVariants}
          >
            <motion.span
              className=" w-[77px] h-[70px] bg-green-500 rounded-full inline-block  mt-2 shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={nutriCareLogo}
                alt="Nutri-Care Logo"
                className="w-[68px] h-[70px] object-cover rounded-full "
              />
            </motion.span>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className=" text-4xl font-bold text-green-500">Nutri</span>
              <span className=" text-4xl font-bold text-yellow-500">
                -Care AI
              </span>
              <br />
              <motion.span
                className=" text-lg  text-white "
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Smart Nutrition.Real Impact
              </motion.span>
            </motion.div>
          </motion.div>

          {/*Contact Info And Social Media*/}

          {/*links*/}
          <motion.div
            className=" relative flex flex-col sm:flex-row p-2 w-full lg:w-250 lg:h-40 gap-8 sm:gap-4 lg:gap-0 lg:space-x-8 justify-between sm:justify-around lg:justify-start items-center sm:items-start"
            variants={itemVariants}
          >
            <motion.div
              className=" flex p-2 w-full sm:w-40 h-auto sm:h-35 justify-center sm:justify-start "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="  w-full sm:w-40 space-y-2 text-center sm:text-left ">
                <motion.h2
                  className=" text-lg font-bold text-white  "
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Quick Links
                </motion.h2>

                <motion.div
                  whileHover={{ scale: 1.05, x: 5 }}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <p
                    onClick={() => navigate("/")}
                    className=" text-sm text-green-500 hover:text-white  cursor-pointer"
                  >
                    Home
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, x: 5 }}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <p
                    onClick={() => navigate("/about")}
                    className=" text-sm text-green-500 hover:text-white  cursor-pointer"
                  >
                    About
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, x: 5 }}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p
                    onClick={() => navigate("/how-it-works")}
                    className=" text-sm text-green-500 hover:text-white cursor-pointer"
                  >
                    How It Works
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, x: 5 }}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p
                    onClick={() => navigate("/contact")}
                    className=" text-sm text-green-500 hover:text-white cursor-pointer"
                  >
                    Contact
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/*Contact Info*/}
            <motion.div
              className=" flex p-2 w-full sm:w-100 h-auto sm:h-35 justify-center sm:justify-start "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className=" w-full sm:w-100 space-y-2 text-center sm:text-left ">
                <motion.h2
                  className=" text-lg font-bold text-white  "
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Contact Info
                </motion.h2>
                <motion.p
                  className=" text-sm text-green-500  hover:text-white"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Nishchintapur, Budge Budge, Kolkata-700138
                </motion.p>
                <motion.p
                  className=" text-sm text-green-500  hover:text-white"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  nutricareai@gmail.com
                </motion.p>
                <motion.p
                  className=" text-sm text-green-500  hover:text-white"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  +(91) 1800-456-7890
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className=" relative lg:absolute flex p-2 w-full sm:w-auto lg:w-70 h-20 gap-3 justify-center sm:justify-start lg:right-7 lg:top-10 items-center mt-4 sm:mt-0 "
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className=" w-13 h-13 rounded-full border-3 border-green-500 cursor-pointer"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <GrLinkedinOption className="text-3xl p-0.5 mt-1.5 ml-2 text-green-50 " />
              </motion.div>
              <motion.div
                className="w-13 h-13 rounded-full border-3 border-green-500 cursor-pointer"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <BsInstagram className="text-3xl p-0.5 mt-2 ml-2 text-green-50 " />
              </motion.div>
              <motion.div
                className="w-13 h-13 rounded-full border-3 border-green-500 cursor-pointer"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <p className="text-3xl p-0.5 mt-0.5 ml-3 font-semibold text-green-50 ">
                  X
                </p>
              </motion.div>
              <motion.div
                className="w-13 h-13 rounded-full border-3 border-green-500 cursor-pointer"
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <IoLogoTwitter className="text-3xl p-0.5 mt-2.5 ml-2.5  text-green-50 " />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Reserved & Dynamic Developer Attribution */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 text-center w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 text-white text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1">
              <motion.div
                className="mt-0.5"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BsCCircle className="text-white text-xs" />
              </motion.div>
              <span>
                {new Date().getFullYear()}{" "}
                <span className="font-bold text-green-500">Nutri-Care AI</span>.
                All rights reserved.
              </span>
            </div>
            <span className="hidden md:inline text-gray-500">|</span>
            <span>
              Developed by{" "}
              <a
                href="https://github.com/Suvajit09"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-yellow-500 hover:text-green-400 underline transition-colors duration-300"
              >
                Suvajit Roy
              </a>{" "}
              &amp; Contributors
            </span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
