import React, { useEffect, useState, useContext, createContext } from "react";
import { authDataContext } from "../context/AuthContextProvider.jsx";
import { calculateQuotaStatus } from "../utils/quotaHelper.js";
import { toast } from "react-toastify";
import axios from "axios";

export const userDataContext = createContext();

export default function UserContext({ children }) {
  const { serverUrl } = useContext(authDataContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPromptedPremium, setHasPromptedPremium] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [isQuotaCapped, setIsQuotaCapped] = useState(false);

  // Gamification state parameters
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

  const triggerPointAwardEffect = (pointsAwarded) => {
    setCoinAnimation({ show: true, points: pointsAwarded });
    setNutriPoints((prev) => prev + pointsAwarded);
  };

  const getCurrentUser = async () => {
    // 🟢 FIXED: If the device has no network connection on refresh, skip the call entirely!
    // This stops the app from getting stuck waiting for an Axios request timeout.
    if (!navigator.onLine) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      if (result.data) {
        const user = result.data;
        setUserData(user);

        // Seed the session hint whenever validation clears successfully
        localStorage.setItem("nutricare_has_session", "true");

        fetchWalletBalance();

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
        // 🟢 NEW: If backend responds but returns empty data, wipe the orphan local flag
        localStorage.removeItem("nutricare_has_session");
      }
    } catch (error) {
      setUserData(null);
      setIsQuotaCapped(false);
      setRemainingDays(0);

      // 🟢 NEW: Smart Session Cleansing Firewall
      // If the server explicitly responds with a 401 or 403 status code, it means the user is online
      // but their temporary session cookie has expired or been deleted. Wipe the flag instantly!
      // If there is NO error.response, it means they are simply offline, so we leave the flag alone.
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("nutricare_has_session");
      }
    } finally {
      setLoading(false);
    }
  };;

  useEffect(() => {
    if (serverUrl) {
      getCurrentUser();
    }
  }, [serverUrl]);

  const value = {
    userData,
    setUserData,
    loading,
    getCurrentUser,
    hasPromptedPremium,
    setHasPromptedPremium,
    remainingDays,
    isQuotaCapped,
    nutriPoints,
    setNutriPoints,
    coinAnimation,
    setCoinAnimation,
    triggerPointAwardEffect,
    fetchWalletBalance,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}
