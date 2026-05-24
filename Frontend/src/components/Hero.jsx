import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import HomeBGImage from "../assets/homePageBackground.jpeg";
import { userDataContext } from "../context/UserContext.jsx";
import Loader from "./Loader.jsx";

// import Navbar from "../components/Navbar.jsx"; // If needed

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(userDataContext);

  useEffect(() => {
    // GSAP Context ensures animations remain scoped to this component
    // and are properly cleaned up when the component unmounts.
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Subtle zoom and fade-in for the background image
      tl.from(".hero-bg", {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
      })
        // 2. Slide up and fade in the titles with a slight stagger
        .from(
          ".hero-title",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          "-=1",
        ) // Start 1 second before the background animation finishes
        // 3. Fade in the description text
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        // 4. Pop in the button
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

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <>
      {/* Render Loader conditionally at the top level of the component */}
      {loading && <Loader />}

      <div
        ref={heroRef}
        className="w-full flex justify-center bg-transparent relative"
      >
        <div
          className="relative w-full max-w-[2000px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[850px] flex items-center justify-start rounded-b-3xl overflow-hidden mx-auto"
          style={{ boxShadow: "2px 2px 8px #8fa98f, -4px -4px 16px #8fa98f" }}
        >
          {/* Background Image */}
          <img
            src={HomeBGImage}
            alt="Home Page Background"
            className="hero-bg absolute inset-0 w-full h-full object-cover object-right sm:object-center z-0"
          />

          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col items-start px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 w-full max-w-[90%] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[1000px] text-black">
            <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3 text-green-500">
              AI That Cares for
            </h1>
            <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 text-amber-400">
              Your Health
            </h1>
            <p className="hero-desc text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semi-bold text-green-300/90 mb-6 sm:mb-8 ">
              <span className="text-amber-300 font-bold">Personalized</span>,{" "}
              <span className="text-amber-300 font-bold">affordable</span>, and{" "}
              <span className="text-amber-300 font-bold">data-driven</span>{" "}
              <br className="hidden sm:block" /> nutrition designed for your
              lifestyle.
            </p>

            {userData ? (
              <button
                onClick={() => {
                  setLoading(true);

                  // Wrap navigate in a small timeout to allow Loader to render,
                  // or just navigate immediately since it's client-side routing
                  setTimeout(() => {
                    navigate("/dashboard");
                    setLoading(false);
                  }, 200);
                }}
                className="hero-btn bg-green-500 text-amber-200 px-6 sm:px-8 xl:px-10 py-3 xl:py-4 rounded-full w-full sm:w-auto min-w-[200px] sm:min-w-[250px] md:min-w-[280px] xl:min-w-[320px] text-base sm:text-lg xl:text-xl font-bold hover:bg-green-600 transition duration-300 shadow-md cursor-pointer"
              >
                {/* {if user is old and visited the dashboard} */}
                {userData.profileCompleted
                  ? `Welcome Back ${userData.name.split(" ")[0]}!`
                  : "Complete Your Profile"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    navigate("/signup");
                    setLoading(false);
                  }, 200);
                }}
                className="hero-btn bg-green-500 text-amber-200 px-6 sm:px-8 xl:px-10 py-3 xl:py-4 rounded-full w-full sm:w-auto min-w-[200px] sm:min-w-[250px] md:min-w-[280px] xl:min-w-[320px] text-base sm:text-lg xl:text-xl font-bold hover:bg-green-600 transition duration-300 shadow-md cursor-pointer"
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
