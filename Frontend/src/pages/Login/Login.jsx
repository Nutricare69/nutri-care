import React, { useEffect, useState, useContext } from "react";
import bgUrl from "../../assets/wallpaper login and signup.jpg"; // blurred page background
import leftImg from "../../assets/loginDesign.jpg";
import nutriCareLogo from "../../assets/nutricareLogo.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";
import { useTheme } from "../../components/theme.js";

export default function Login() {
  const [reveal, setReveal] = useState(false); // start animation
  const [settle, setSettle] = useState(false); // overshoot -> settle
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 🟢 Show loader when login starts
    try {
      await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
=======
   const navigate = useNavigate();
   const { serverUrl } = useContext(authDataContext);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const {  getCurrentUser } = useContext(userDataContext);
   const [loading, setLoading] = useState(false);
   const { isDark } = useTheme();

   const handleLogin = async (e) => {
     e.preventDefault();
     setLoading(true); // 🟢 Show loader when login starts
     try {
        await axios.post(
         serverUrl + "/api/auth/login",
         {
           email,
           password,
         },
         { withCredentials: true }
       );
>>>>>>> origin/fix/user-details-form-ui
      //  setUserData(result.data);
      //  alert("login successful!");
      await getCurrentUser();

      //  console.log(result);
    } catch (error) {
      console.error("Error logging in:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 200);
      // 🟢 Hide loader when login finishes (success or error)
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => setReveal(true), 50); // slide in
    const t2 = setTimeout(() => setSettle(true), 800); // then settle to final position
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const speedClass = settle ? "duration-500" : "duration-700";
  const leftPhase = !reveal
    ? "-translate-x-full"
    : !settle
      ? "translate-x-[10%]"
      : "translate-x-0";
  const rightPhase = !reveal
    ? "translate-x-full"
    : !settle
      ? "-translate-x-[10%]"
      : "translate-x-0";

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Blurred fullscreen background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover scale-105 blur-md"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
      </div>

      {/* Centered, smaller two-panel card */}
      <div className=" relative  mx-auto my-8  md:my-12  w-[95vw] max-w-5xl h-auto min-h-[620px] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-black/5 dark:ring-white/10">
        {/* Left panel: gradient bg, icon with no bg (SVG only), slides across the center */}
        <div
          className={` flex flex-col items-center justify-center bg-gradient-to-br from-[#5aa87f] to-[#7fbe9a] dark:from-[#1b3f27] dark:to-[#2e5f3f] rounded-l-3xl p-8 md:p-10 transform transition-transform ${speedClass} ease-out ${leftPhase}`}
        >
          {/* left design image  */}
          <img
            src={leftImg}
            alt="Nutri-Care"
            className="w-60 md:w-72 lg:w-80 h-auto rounded-full "
          />
          {/* Text slightly below the icon */}
          <div className="mt-6 text-white text-center px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
              Welcome Back!
            </h2>
            <p className="text-white/90 text-base md:text-lg">
              Your journey to better health continues.
            </p>
          </div>
        </div>

        {/* Right panel: form, slides across the center */}
        <div
          className={`bg-white/95 dark:bg-[#0c130d]/95 text-gray-800 dark:text-zinc-100 backdrop-blur-sm p-6 md:p-10 transform transition-transform rounded-r-3xl ${speedClass} ease-out ${rightPhase}`}
        >
          <div className="mb-6 flex items-center gap-1.5">
            <div className="w-[70px] h-[70px] ">
              <img
                src={nutriCareLogo}
                alt="Nutri-Care Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Nutri-Care Logo Text */}
            <div className="flex items-center gap-0.5">
              <span className="text-lg md:text-xl font-semibold text-green-500">
                Nutri
              </span>
              <span className="text-lg md:text-xl font-semibold text-yellow-500 ">
                -
              </span>
              <span className="text-lg md:text-xl font-semibold text-yellow-500 ">
                Care
              </span>
            </div>
          </div>
<<<<<<< HEAD
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2e3a34] mb-10">
=======

          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2e3a34] dark:text-green-400 mb-10">
>>>>>>> origin/fix/user-details-form-ui
            Log In to Your Account
          </h1>
          {loading && <Loader />} {/* Show loader when loading state is true */}
          <form
            className="space-y-9 max-w-md top-"
            action=""
            onSubmit={handleLogin}
          >
            <input
              type="email"
              id="email"
              placeholder="john@gmail.com"
              className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
<<<<<<< HEAD
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password John@1234"
                className="w-full rounded-full border border-[#e3e6df] px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
=======
             <div className="relative">
                
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password John@1234"
              className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
>>>>>>> origin/fix/user-details-form-ui
              />
              <div
                className="absolute right-4 top-1/4  transform -translate-y-1/12 cursor-pointer select-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <IoMdEyeOff className="w-7 h-7 text-gray-400" />
                ) : (
                  <IoMdEye className="w-7 h-7 text-gray-400" />
                )}
              </div>
            </div>

            <button
              type="submit"
<<<<<<< HEAD
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#7fbe9a] to-[#5aa87f] shadow hover:opacity-95"
=======
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#7fbe9a] to-[#5aa87f] shadow hover:opacity-95 cursor-pointer"
             
>>>>>>> origin/fix/user-details-form-ui
            >
              Log In
            </button>
            <label className="flex items-start gap-3 text-sm text-[#444] dark:text-zinc-300">
              <input type="checkbox" className="mt-1 accent-[#7fbe9a]" />
              <span>Remember Me</span>
              <span className="text-sm text-[#6b7280] dark:text-zinc-400 ml-auto cursor-pointer">Forgot Password?</span>
            </label>
          </form>
<<<<<<< HEAD
          <p className="mt-6 text-sm text-[#6b7280]">
=======

          <p className="mt-6 text-sm text-[#6b7280] dark:text-zinc-400">
>>>>>>> origin/fix/user-details-form-ui
            Don't have an account?{" "}
            <a href="/signup" className="underline text-[#5aa87f] dark:text-green-400">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
