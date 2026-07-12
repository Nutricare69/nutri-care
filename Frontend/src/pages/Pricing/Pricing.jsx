import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, X, ArrowLeft, Coins, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import axios from "axios";

export default function Pricing() {
  const { userData, nutriPoints, fetchWalletBalance } =
    useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  // Local state metrics to handle pricing previews
  const basePrice = 399;
  const [discountValue, setDiscountValue] = useState(0);
  const [checkoutPrice, setCheckoutPrice] = useState(399);

  // Frontend client-side preview calculations mirroring backend parameters
  useEffect(() => {
    if (nutriPoints > 0) {
      let calcDiscount = 0;
      if (nutriPoints < 200) calcDiscount = nutriPoints * 0.1;
      else if (nutriPoints >= 200 && nutriPoints < 500)
        calcDiscount = nutriPoints * 0.15;
      else calcDiscount = nutriPoints * 0.25;

      const roundedDiscount = Math.round(calcDiscount);
      const maximumAllowedCap = Math.round(basePrice * 0.5); // 50% max allowed cap rule
      const finalAppliedDeduction = Math.min(
        roundedDiscount,
        maximumAllowedCap,
      );

      setDiscountValue(finalAppliedDeduction);
      setCheckoutPrice(basePrice - finalAppliedDeduction);
    } else {
      setDiscountValue(0);
      setCheckoutPrice(basePrice);
    }
  }, [nutriPoints]);

  const loadRazorpayCore = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePremiumUpgrade = async () => {
    const res = await loadRazorpayCore();
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { planId: "6a31560f040f93760704d896" },
        { withCredentials: true },
      );

      const options = {
        key: orderRes.data.razorpayKeyId,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "NutriCare",
        description: "30-Day Premium Plan",
        order_id: orderRes.data.orderId,
        image:
          "https://res.cloudinary.com/ddkgrqekv/image/upload/v1780849496/nutricareLogo_nlzjrj.jpg",
        handler: async function (response) {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          await axios.post(
            `${serverUrl}/api/payment/verify-payment`,
            verifyData,
            { withCredentials: true },
          );

          await fetchWalletBalance(); // Re-fetch balance to update wallet view on success
          navigate("/payment-success");
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: { color: "#22c55e" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Error initiating payment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf5ee] to-[#f4faf7] flex items-center justify-center p-6 relative">
      <motion.div
        className="top-6 left-6 absolute z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-3.5 bg-white text-green-700 hover:text-white hover:bg-green-600 rounded-2xl shadow-md border border-green-100/50 transition-all duration-200 cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </motion.div>

      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-green-600 mb-4 tracking-tight"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 font-medium max-w-md mx-auto"
          >
            Unlock your full potential with our premium nutrition plans.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-stretch">
          {/* Free Plan Card Option */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 bg-white p-8 rounded-3xl shadow-lg border-t-4 border-gray-300 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Free Plan</h3>
              <p className="text-gray-500 mt-2">Perfect to get started</p>
              <div className="my-6 text-4xl font-extrabold text-gray-800">
                ₹0{" "}
                <span className="text-lg font-normal text-gray-500">
                  / forever
                </span>
              </div>

              {/* Updated Free Tier Features list matrix block */}
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500 shrink-0" /> Basic
                  Diet Logging
                </li>
                <li className="flex gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500 shrink-0" /> Community
                  Access
                </li>
                <li className="flex gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span>
                    Upto{" "}
                    <strong className="font-bold text-shadow-gray-500">
                      5
                    </strong>{" "}
                    AI Personalized Meal Plans per Month
                  </span>
                </li>
                <li className="flex gap-3 text-gray-600">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span>
                    Weekly Health Reports until{" "}
                    <strong className="font-bold text-shadow-gray-500">
                      5
                    </strong>
                    th plan
                  </span>
                </li>
                <li className="flex gap-3 text-gray-500">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span>
                    Diet Plan Generation Up to{" "}
                    <strong className="font-bold text-shadow-gray-500">
                      7
                    </strong>{" "}
                    days
                  </span>
                </li>
                <li className="flex gap-3 text-gray-500 line-through">
                  <X className="text-red-500 shrink-0" /> No Unlimited Access
                </li>
                <li className="flex gap-3 text-gray-500 line-through">
                  <X className="text-red-500 shrink-0" />
                  <span>
                    No Diet Plan Generation Up to{" "}
                    <strong className="font-bold text-shadow-gray-500">
                      14
                    </strong>{" "}
                    days
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 rounded-xl font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
            >
              Current Active Plan
            </button>
          </motion.div>

          {/* Premium Plan Card Option */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-3xl shadow-xl border-t-4 border-yellow-400 text-white relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-bl-xl text-sm shadow-md">
              RECOMMENDED
            </div>
            <div>
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <p className="text-green-100 mt-2">
                Unlimited Access for 30 Days
              </p>

              {/* Context-aware dynamic price calculation layout */}
              <div className="my-6 space-y-1">
                {discountValue > 0 ? (
                  <>
                    <div className="text-xs font-bold uppercase tracking-wider text-yellow-300 bg-white/10 px-2.5 py-1 rounded-md w-max flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Point Discount Applied
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">
                        ₹{checkoutPrice}
                      </span>
                      <span className="text-sm font-medium text-green-200 line-through">
                        ₹{basePrice}
                      </span>
                      <span className="text-xs font-bold text-yellow-300">
                        Save ₹{discountValue}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-extrabold">
                    ₹{basePrice}{" "}
                    <span className="text-lg font-normal text-green-200">
                      / 30 days
                    </span>
                  </div>
                )}
              </div>

              {/* Updated Premium Tier Features list matrix block */}
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" /> Advanced
                  Diet Logging
                </li>
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" />{" "}
                  Community Access
                </li>
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" /> AI
                  Personalized Meal Plans
                </li>
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" /> Weekly
                  Health Reports
                </li>
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" />{" "}
                  Unlimited Access
                </li>
                <li className="flex gap-3 text-green-50">
                  <CheckCircle2 className="text-yellow-400 shrink-0" />
                  <span>
                    Diet Plan Generation Up to{" "}
                    <strong className="font-bold text-yellow-400">2</strong>{" "}
                    Weeks
                  </span>
                </li>
              </ul>

              {/* Wallet Summary Checklist Banner Notification Box */}
              {nutriPoints > 0 && (
                <div className="mb-6 p-3.5 bg-black/10 border border-white/10 rounded-2xl flex items-center gap-2.5 text-xs text-green-50 font-medium">
                  <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                  Using {nutriPoints} tokens clears your balance to zero upon
                  checking out.
                </div>
              )}
            </div>

            <button
              onClick={handlePremiumUpgrade}
              className="w-full py-4 rounded-xl font-bold bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-lg cursor-pointer"
            >
              {userData?.isPremium ? "Extend Plan" : "Upgrade to Premium"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
