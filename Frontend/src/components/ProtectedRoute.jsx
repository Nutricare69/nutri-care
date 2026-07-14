import React, { useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

export default function ProtectedRoute() {
  const { userData, loading } = useContext(userDataContext);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const hasSessionHint =
    localStorage.getItem("nutricare_has_session") === "true";

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="w-9 h-9 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Guard 1: If online and no user state exists, send them to login
  if (!userData && !isOffline) {
    return <Navigate to="/login" replace />;
  }

  // Guard 2: If offline but no session hint token exists, block entry
  if (!userData && isOffline && !hasSessionHint) {
    return <Navigate to="/login" replace />;
  }

  // Safe Permitted Render Layout Area
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {isOffline && (
        /*  FIXED: Changed position rules to fixed top-0 layer with maximum stacking priority */
        <div className="bg-amber-500  text-white text-center py-2 text-xs font-bold w-full fixed top-0 left-0 right-0 z-[99999] shadow-md tracking-wider flex items-center justify-center gap-2 select-none animate-pulse h-8">
          <span>📡</span> You are currently offline. Please reconnect to the internet to access all features. 
        </div>
      )}

      {/* 
         FIXED: Automatically applies 32px of top padding when offline. 
        This perfectly pushes your desktop navigation, sidebar wrappers, and content containers 
        downward so the floating banner never hides or clips your design elements!
      */}
      <div className={`flex-1 flex flex-col ${isOffline ? "pt-8" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}
