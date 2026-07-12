import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import bgUrl from "../../assets/wallpaper login and signup.jpg";
import leftImg from "../../assets/loginDesign.jpg";
import nutriCareLogo from "../../assets/nutricareLogo.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify"; // 🟢 NEW: Imported Toastify engine
import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";
import { useTheme } from "../../components/theme.js";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reveal, setReveal] = useState(false);
  const [settle, setSettle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setloading] = useState(false);
  const { isDark } = useTheme();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const NAME_REGEX = /^[A-Za-z\s]{2,}$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // 🟢 FIXED: Swapped out all blocking alert popups for clean warning toasts
    if (!NAME_REGEX.test(name)) {
      toast.warn(
        "Please enter a valid name (at least 2 letters, no special characters).",
      );
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      toast.warn(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify your entries.");
      return;
    }

    setloading(true);
    try {
      await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password },
        { withCredentials: true },
      );

      // 🟢 NEW: Fire success toast configuration right before changing screen location states
      toast.success("Account created successfully! Welcome to NutriCare.");

      setTimeout(() => {
        navigate("/");
        setloading(false);
      }, 200);
    } catch (error) {
      console.error("Error signing up:", error);
      // 🟢 FIXED: Replaced standard alert string compilation with an error toast alert
      toast.error(
        "Signup failed: " + (error.response?.data?.message || error.message),
      );
      setloading(false);
    }
  };

  useEffect(() => {
    setloading(false);
  }, [location.pathname]);

  useEffect(() => {
    const t1 = setTimeout(() => setReveal(true), 50);
    const t2 = setTimeout(() => setSettle(true), 800);
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

      {/* Centered card container */}
      <div className="mx-auto my-8 md:my-12 w-[95vw] max-w-5xl h-auto min-h-[620px] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-black/5 dark:ring-white/10">
        {/* Left panel */}
        <div
          className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#5aa87f] to-[#7fbe9a] dark:from-[#1b3f27] dark:to-[#2e5f3f] rounded-l-3xl p-8 md:p-10 transform transition-transform ${speedClass} ease-out ${leftPhase}`}
        >
          <img
            src={leftImg}
            alt="Nutri-Care"
            className="w-60 md:w-72 lg:w-80 h-auto rounded-full"
          />
          <div className="mt-6 text-white text-center px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
              Join Our Community!
            </h2>
            <p className="text-white/90 text-base md:text-lg">
              Start your personalized health journey today.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div
          className={`bg-white/95 dark:bg-[#0c130d]/95 text-gray-800 dark:text-zinc-100 rounded-r-3xl backdrop-blur-sm p-6 md:p-10 transform transition-transform ${speedClass} ease-out ${rightPhase}`}
        >
          <div className="mb-6 flex items-center gap-1.5">
            <div className="w-[70px] h-[70px]">
              <img
                src={nutriCareLogo}
                alt="Nutri-Care Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-lg md:text-xl font-semibold text-green-500">
                Nutri
              </span>
              <span className="text-lg md:text-xl font-semibold text-yellow-500">
                -
              </span>
              <span className="text-lg md:text-xl font-semibold text-yellow-500">
                Care
              </span>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2e3a34] dark:text-green-400 mb-4">
            Create Your Account
          </h1>
          {loading && <Loader />}

          <form className="space-y-3 max-w-md" onSubmit={handleSignUp}>
            {/* Full Name Container */}
            <div className="flex flex-col gap-0.5 w-full">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span> Letters
                and spaces only, min 2 characters.
              </p>
            </div>

            {/* Email Container */}
            <div className="flex flex-col gap-0.5 w-full">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
              />
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span> Enter a
                valid email address structure.
              </p>
            </div>

            {/* Password Container */}
            <div className="flex flex-col gap-0.5 w-full">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  value={password}
                />
                <div
                  className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-2xl text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoMdEyeOff className="w-7 h-7 text-gray-400" />
                  ) : (
                    <IoMdEye className="w-7 h-7 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span> Min 8
                chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol.
              </p>
            </div>

            {/* Confirm Password Container */}
            <div className="flex flex-col gap-0.5 w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span> Must
                match the password entered above.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#7fbe9a] to-[#5aa87f] shadow hover:opacity-95 cursor-pointer mt-2"
            >
              Sign Up
            </button>

            <label className="flex items-start gap-3 text-sm text-[#444] dark:text-zinc-300 pt-1 select-none">
              <input
                type="checkbox"
                className="mt-1 accent-[#7fbe9a] cursor-pointer"
                required
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/policy"
                  className="text-[#5aa87f] dark:text-green-400 hover:underline font-bold transition-all"
                >
                  Terms & Privacy Policy
                </Link>
              </span>
            </label>
          </form>

          <p className="mt-6 text-sm text-[#6b7280] dark:text-zinc-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline text-[#5aa87f] dark:text-green-400"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
