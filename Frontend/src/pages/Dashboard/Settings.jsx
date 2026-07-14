import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, AlertTriangle } from "lucide-react"; //  UPDATED: Added AlertTriangle
import { useTheme } from "../../components/theme.js";
import { authDataContext } from "../../context/AuthContextProvider";
import { toast } from "react-toastify"; //  NEW: Imported toast notification engine
import axios from "axios";

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { serverUrl } = useContext(authDataContext);
  const [isOfflineView, setIsOfflineView] = useState(!navigator.onLine); //  NEW: Component connection tracker

  // Controlled password form state variables
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //  NEW: Monitor live hardware connection changes while user is on the tab
  useEffect(() => {
    const handleOnline = () => setIsOfflineView(false);
    const handleOffline = () => setIsOfflineView(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // 🟢 NEW: Intercept password change attempts if internet line is down
    if (!navigator.onLine) {
      toast.error(
        "Network connection down. Password modifications require an active internet connection.",
      );
      return;
    }

    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Client-side validations ( FIXED: Upgraded alerts to matching theme warning toasts)
    if (!PASSWORD_REGEX.test(newPassword)) {
      toast.warn(
        "New password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Confirm password must exactly match your new password.");
      return;
    }

    try {
      const response = await axios.put(
        `${serverUrl}/api/auth/update-password`,
        { currentPassword, newPassword },
        { withCredentials: true },
      );

      toast.success(response.data.message || "Password updated successfully!");

      // Reset input fields upon success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change failure:", error);
      toast.error(
        error.response?.data?.message ||
          "Could not update your password. Please verify current credentials.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 w-full"
    >
      {/* Title Layout Section - Flush Extreme Left */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 bg-green-500 rounded-full shrink-0" />
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Settings
        </h3>
      </div>

      {/* Inner Workspace Wrapper Container */}
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        {/* NEW: Local Sub-Page Workspace Offline View Alert Banner */}
        {isOfflineView && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3.5"
          >
            <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Offline mode active. Connect to the internet to update your
              password and credentials!
            </div>
          </motion.div>
        )}

        {/* Theme Settings Card Panel */}
        <div
          className="bg-white dark:bg-[#0c130d] rounded-3xl p-6 sm:p-8 shadow-lg border border-transparent dark:border-green-950/20 transition-colors duration-300"
          style={{
            boxShadow: isDark
              ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
              : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
          }}
        >
          <h4 className="text-lg font-bold text-gray-800 dark:text-zinc-200 mb-4 tracking-tight">
            Theme Mode
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "light", icon: Sun, label: "Light" },
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "system", icon: Monitor, label: "System" },
            ].map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <motion.button
                  key={themeOption.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTheme(themeOption.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    theme === themeOption.id
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                      : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      theme === themeOption.id
                        ? "text-green-500 dark:text-green-400"
                        : "text-gray-600 dark:text-zinc-400"
                    }`}
                  />
                  <span className="font-semibold">{themeOption.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Password Settings Card Panel */}
        <div
          className="bg-white dark:bg-[#0c130d] rounded-3xl p-6 sm:p-8 shadow-lg border border-transparent dark:border-green-950/20 transition-colors duration-300"
          style={{
            boxShadow: isDark
              ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
              : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
          }}
        >
          <h4 className="text-lg font-bold text-gray-800 dark:text-zinc-200 mb-4 tracking-tight">
            Change Password
          </h4>
          <form className="space-y-4" onSubmit={handlePasswordUpdate}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isOfflineView} // 🟢 NEW: Disable the inputs gracefully if offline
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={
                  isOfflineView
                    ? "Unavailable offline"
                    : "Enter current password"
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isOfflineView}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={
                  isOfflineView
                    ? "Unavailable offline"
                    : "Enter new password (e.g. John@1234)"
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isOfflineView}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={
                  isOfflineView
                    ? "Confirm password offline"
                    : "Confirm new password"
                }
                required
              />
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={isOfflineView ? {} : { scale: 1.01 }}
                whileTap={isOfflineView ? {} : { scale: 0.99 }}
                type="submit"
                disabled={isOfflineView} //  NEW: Disable the button cleanly if offline
                className={`w-full px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  isOfflineView
                    ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 cursor-not-allowed shadow-none"
                    : "bg-green-500 hover:bg-green-600 text-white hover:shadow-green-500/10 cursor-pointer"
                }`}
              >
                {isOfflineView
                  ? "Password Updates Paused Offline"
                  : "Update Password"}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
