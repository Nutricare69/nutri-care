import React, { useContext, useState, useEffect, createContext } from "react";
import { authDataContext } from "../context/AuthContextProvider.jsx";
import { calculateQuotaStatus } from "../utils/quotaHelper.js";
import { toast } from "react-toastify";
import axios from "axios";

export const userDataContext = createContext();

export default function UserContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const [userData, setUserData] = useState(null);
  const [hasPromptedPremium, setHasPromptedPremium] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [isQuotaCapped, setIsQuotaCapped] = useState(false);

  // 🟢 NEW: Gamification state parameters
  const [nutriPoints, setNutriPoints] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState({
    show: false,
    points: 0,
  });

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/points/wallet`, {
        withCredentials: true,
      });
      if (res.data) setNutriPoints(res.data.totalPoints);
    } catch (err) {
      console.error("Failed to fetch points:", err);
    }
  };

  // 🟢 NEW: Global animation claim function available to all workspaces
  const triggerPointAwardEffect = (pointsAwarded) => {
    setCoinAnimation({ show: true, points: pointsAwarded });
    setNutriPoints((prev) => prev + pointsAwarded);
  };

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      if (result.data) {
        const user = result.data;
        setUserData(user);
        fetchWalletBalance(); // Sync point tokens together on refresh loops

        if (!user.isPremium && user.lastMealPlanDate) {
          const status = calculateQuotaStatus(user.lastMealPlanDate);
          if (status.shouldNotifyRenewal) {
            setIsQuotaCapped(false);
            setRemainingDays(0);
            toast.success(
              "Your free meal plan generation quota has been renewed! Enjoy 5 new plans.",
            );
          } else {
            setRemainingDays(status.remainingDays);
            setIsQuotaCapped(user.freePlansUsedThisMonth >= 5);
          }
        } else {
          setIsQuotaCapped(false);
          setRemainingDays(0);
        }
      } else {
        setUserData(null);
        setIsQuotaCapped(false);
        setRemainingDays(0);
      }
    } catch (error) {
      setUserData(null);
      setIsQuotaCapped(false);
      setRemainingDays(0);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [serverUrl]);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    hasPromptedPremium,
    setHasPromptedPremium,
    remainingDays,
    isQuotaCapped,
    nutriPoints, // 🟢 Exposed gamification points total
    setNutriPoints,
    coinAnimation, // 🟢 Exposed animation state object
    setCoinAnimation,
    triggerPointAwardEffect, // 🟢 Exposed claim trigger wrapper
    fetchWalletBalance,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}
