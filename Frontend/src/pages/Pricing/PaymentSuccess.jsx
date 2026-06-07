import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

export default function PaymentSuccess() {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoToDashboard = () => {
    setLoading(true); // Turn loader on

    // Simulate a brief delay to allow background data syncing before landing on the dashboard
    setTimeout(() => {
      setLoading(false); // Turn loader off (optional since we are navigating away)
      // navigate("/dashboard");
      window.location.href = "/dashboard";
    }, 1500); // 1.5 seconds delay
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-24 h-24 text-green-500" />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-500 mb-8">
          Thank you for upgrading. Your premium features have been unlocked and
          your 30-day access is now active.
        </p>
        {loading && <Loader />}
        <button
          onClick={handleGoToDashboard}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
