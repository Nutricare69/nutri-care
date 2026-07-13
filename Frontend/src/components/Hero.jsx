import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { userDataContext } from "../context/UserContext.jsx";
import Loader from "./Loader.jsx";

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { userData } = useContext(userDataContext);

  //image
  const HomeBGImage =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/homePageBackground_ex4fud.jpg";

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-bg", {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
      })
        .from(
          ".hero-title",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=1",
        )
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        .from(
          ".hero-btn",
          {
            scale: 0.8,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* 
        🟢 FIXED: Added 'max-w-[1400px]' and 'mx-auto' here.
        Now when you zoom out, the hero wrapper stops expanding at 1400px and stays 
        perfectly centered—aligning beautifully with your Core Features section!
      */}
      <div
        ref={heroRef}
        className="w-full max-w-[2000px] mx-auto bg-transparent relative px-4 sm:px-6 md:py-5 md:px-8 mt-6 select-none"
      >
        <div
          className="relative w-full min-h-[420px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] flex items-center justify-start rounded-3xl overflow-hidden"
          style={{ boxShadow: "0px 10px 30px rgba(143, 169, 143, 0.25)" }}
        >
          {/* Background Image — centered on all sizes */}
          <img
            src={HomeBGImage}
            alt="Home Page Background"
            className="hero-bg absolute inset-0 w-full h-full object-cover object-center z-0"
          />

          {/* Gradient overlay — strong dark on left where text lives, fades to transparent right */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/55 sm:via-black/45 md:via-black/35 to-transparent" />

          {/* Additional bottom-of-screen fade for mobile readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/30 via-transparent to-transparent sm:hidden" />

          {/* Overlay Content */}
          <div className="relative z-[2] flex flex-col items-start px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 w-full max-w-[95%] sm:max-w-[80%] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[1000px] py-12 sm:py-0">
            <h1
              className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 text-green-400"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
            >
              AI That Cares for
            </h1>
            <h1
              className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 text-amber-400"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
            >
              Your Health
            </h1>
            <p
              className="hero-desc text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white/95 mb-6 sm:mb-8 leading-relaxed max-w-[90%] sm:max-w-full"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
            >
              <span className="text-amber-300 font-bold">Personalized</span>,{" "}
              <span className="text-amber-300 font-bold">affordable</span>, and{" "}
              <span className="text-amber-300 font-bold">data-driven</span>{" "}
              <br className="hidden sm:block" /> nutrition designed for your
              lifestyle.
            </p>

            {userData ? (
              <button
                onClick={() => {
                  setTimeout(() => {
                    navigate("/dashboard");
                  }, 200);
                }}
                className="hero-btn bg-green-500 text-white w-full sm:w-auto px-6 sm:px-8 xl:px-10 py-3 xl:py-4 rounded-full min-w-[200px] sm:min-w-[250px] md:min-w-[280px] xl:min-w-[320px] text-sm sm:text-lg xl:text-xl font-bold hover:bg-green-400 transition duration-300 shadow-xl shadow-black/40 cursor-pointer text-center"
              >
                {userData.profileCompleted
                  ? `Welcome Back ${userData.name.split(" ")[0]}!`
                  : "Complete Your Profile"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setTimeout(() => {
                    navigate("/signup");
                  }, 200);
                }}
                className="hero-btn bg-green-500 text-white w-full sm:w-auto px-6 sm:px-8 xl:px-10 py-3 xl:py-4 rounded-full min-w-[200px] sm:min-w-[250px] md:min-w-[280px] xl:min-w-[320px] text-sm sm:text-lg xl:text-xl font-bold hover:bg-green-400 transition duration-300 shadow-xl shadow-black/40 cursor-pointer text-center"
              >
                Start My Nutrition Journey
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
