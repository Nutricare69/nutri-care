import React, { useEffect, useState, useContext } from "react";
import nutriCareLogo from "../../assets/nutricareLogo.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 🟢 NEW: Imported Toastify engine
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";
import { useTheme } from "../../components/theme.js";

export default function Login() {
  const [reveal, setReveal] = useState(false);
  const [settle, setSettle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { getCurrentUser } = useContext(userDataContext);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  //image 

  const leftImg = "https://res.cloudinary.com/ddkgrqekv/image/upload/loginDesign_leetsx.jpg";
  const bgUrl =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/wallpaper_login_and_signup_sofnql.jpg";

  // 🟢 READ: Hydrate input values out of localStorage during initial layout mount stage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        serverUrl + "/api/auth/login",
        { email, password, rememberMe },
        { withCredentials: true },
      );

      // 🟢 WRITE: Store configuration preferences natively inside browser instance
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.setItem("rememberMe", "false");
      }

      await getCurrentUser();
      toast.success("Login successful! Welcome back to NutriCare.");

      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 200);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "Login failed: " + (error.response?.data?.message || error.message),
      );
      setLoading(false);
    }
  };

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
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover scale-105 blur-md"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
      </div>

      <div className="relative mx-auto my-8 md:my-12 w-[95vw] max-w-5xl h-auto min-h-[620px] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 grid-rows-1 ring-1 ring-black/5 dark:ring-white/10">
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#5aa87f] to-[#7fbe9a] dark:from-[#1b3f27] dark:to-[#2e5f3f] rounded-l-3xl p-8 md:p-10 transform transition-transform ${speedClass} ease-out ${leftPhase}`}
        >
          <img
            src={leftImg}
            alt="Nutri-Care"
            className="w-60 md:w-72 lg:w-80 h-auto rounded-full"
          />
          <div className="mt-6 text-white text-center px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
              Welcome Back!
            </h2>
            <p className="text-white/90 text-base md:text-lg">
              Your journey to better health continues.
            </p>
          </div>
        </div>

        <div
          className={`bg-white/95 dark:bg-[#0c130d]/95 text-gray-800 dark:text-zinc-100 backdrop-blur-sm p-6 md:p-10 transform transition-transform rounded-r-3xl ${speedClass} ease-out ${rightPhase}`}
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

          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2e3a34] dark:text-green-400 mb-6">
            Log In to Your Account
          </h1>
          {loading && <Loader />}

          <form className="space-y-5 max-w-md" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1 w-full">
              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span> Must be a
                valid format (e.g., name@domain.com)
              </p>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password Jack@1234"
                  className="w-full rounded-full border border-[#e3e6df] dark:border-green-800/40 bg-white dark:bg-zinc-900/60 px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40 dark:focus:ring-green-800/40 text-gray-950 dark:text-white"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <IoMdEyeOff className="w-7 h-7 text-gray-400" />
                  ) : (
                    <IoMdEye className="w-7 h-7 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 px-4">
                <span className="text-red-500 font-bold mr-1">*</span>{" "}
                Case-sensitive account authentication field.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#7fbe9a] to-[#5aa87f] shadow hover:opacity-95 cursor-pointer mt-2"
            >
              Log In
            </button>

            <label className="flex items-start gap-3 text-sm text-[#444] dark:text-zinc-300 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-1 accent-[#7fbe9a]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
              <span className="text-sm text-[#6b7280] dark:text-zinc-400 ml-auto cursor-pointer">
                Forgot Password?
              </span>
            </label>
          </form>
          <p className="mt-6 text-sm text-[#6b7280] dark:text-zinc-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="underline text-[#5aa87f] dark:text-green-400"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}