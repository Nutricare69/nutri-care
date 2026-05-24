import React, { useEffect, useState,useContext, use } from 'react';
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import bgUrl from '../../assets/wallpaper login and signup.jpg'; // blurred page background
import leftImg from '../../assets/loginDesign.jpg';
import nutriCareLogo from '../../assets/nutricareLogo.jpg'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
// import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import Loader  from '../../components/Loader';

export default function SignUp() {
  const navigate = useNavigate();
  const [reveal, setReveal] = useState(false);   // start animation
  const [settle, setSettle] = useState(false);   // overshoot -> settle
  const [showPassword, setShowPassword] = useState(false);
     const { serverUrl } = useContext(authDataContext);
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [loading , setloading] = useState(false);
    //  const { userData, setUserData } = useContext(userDataContext);

    


     const handleSignUp = async (e) => {
       e.preventDefault();
       setloading(true);

       try {
         const result = await axios.post(
           serverUrl + "/api/auth/signup",
           {
             name,
             email,
             password,
           },
           { withCredentials: true }
         );
        //  setUserData(result.data);
         console.log(result);
        //  alert("Signup successful!");
         

         // Optional: Show success message
       } catch (error) {
         
         console.error("Error signing up:", error);
         alert(
           "Signup failed: " + (error.response?.data?.message || error.message)
         );
       } finally {
        setTimeout(()=> {
        navigate("/login");
        setloading(false);
       },200)}
     };
     useEffect(()=>{
      setloading(false);
     },[location.pathname]);

  useEffect(() => {
    const t1 = setTimeout(() => setReveal(true), 50);      // slide in
    const t2 = setTimeout(() => setSettle(true), 800);     // then settle to final position
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const speedClass = settle ? 'duration-500' : 'duration-700';
  const leftPhase  = !reveal ? '-translate-x-full' : !settle ? 'translate-x-[10%]' : 'translate-x-0';
  const rightPhase = !reveal ? 'translate-x-full'  : !settle ? '-translate-x-[10%]' : 'translate-x-0';

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Blurred fullscreen background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover scale-105 blur-md"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Centered, smaller two-panel card */}
      <div className="mx-auto my-8 md:my-12 w-[95vw] max-w-5xl h-auto min-h-[620px] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-black/5">
        {/* Left panel: gradient bg, icon with no bg (SVG only), slides across the center */}
        <div
          className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#5aa87f] to-[#7fbe9a] rounded-l-3xlp-8 md:p-10 transform transition-transform ${speedClass} ease-out ${leftPhase}`}
        >
          {/* left design image  */}
          <img
            src={leftImg}
            alt="Nutri-Care"
            className="w-60 md:w-72 lg:w-80 h-auto rounded-full "
          />
          {/* Text slightly below the icon */}
          <div className="mt-6 text-white text-center px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
              Join Our Community!
            </h2>
            <p className="text-white/90 text-base md:text-lg">
              Start your personalized health journey today.
            </p>
          </div>
        </div>

        {/* Right panel: form, slides across the center */}
        <div
          className={`bg-white/95 rounded-r-3xlbackdrop-blur-sm p-6 md:p-10 transform transition-transform ${speedClass} ease-out ${rightPhase}`}
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

          <h1 className="text-2xl md:text-4xl font-extrabold text-[#2e3a34] mb-6">
            Create Your Account
          </h1>
          {loading && <Loader/> } 
          <form
            className="space-y-4 max-w-md"
            action=""
            onSubmit={handleSignUp}
          >
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              className="w-full rounded-full border border-[#e3e6df] px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              className="w-full rounded-full border border-[#e3e6df] px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40"
              onChange={(e) => setEmail(e.target.value)}
              required
              value={email}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full rounded-full border border-[#e3e6df] px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40"
                onChange={(e) => setPassword(e.target.value)}
                required
                value={password}
              />
              <div
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-2xl text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoMdEye className="w-7 h-7 text-gray-400" />
                ) : (
                  <IoMdEyeOff className="w-7 h-7 text-gray-400" />
                )}
              </div>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full rounded-full border border-[#e3e6df] px-5 py-3 outline-none focus:ring-2 focus:ring-[#7fbe9a]/40"
            />

            <button
              type="submit"
              className="w-full rounded-full py-3 font-semibold text-white bg-gradient-to-r from-[#7fbe9a] to-[#5aa87f] shadow hover:opacity-95"
            >
              Sign Up
            </button>

            <label className="flex items-start gap-3 text-sm text-[#444]">
              <input type="checkbox" className="mt-1 accent-[#7fbe9a]" />
              <span>I agree to Terms & Privacy Policy</span>
            </label>
          </form>

          <p className="mt-6 text-sm text-[#6b7280]">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}