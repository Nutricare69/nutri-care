import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../components/theme.js";

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h3>

      {/* Theme Settings */}
      <div
        className="bg-white dark:bg-[#0c130d] rounded-3xl p-8 shadow-lg border border-transparent dark:border-green-950/20"
        style={{
          boxShadow: isDark
            ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
            : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
        }}
      >
        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Theme Mode</h4>
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

      {/* Password Settings */}
      <div
        className="bg-white dark:bg-[#0c130d] rounded-3xl p-8 shadow-lg border border-transparent dark:border-green-950/20"
        style={{
          boxShadow: isDark
            ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
            : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
        }}
      >
        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Change Password
        </h4>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-gray-950 dark:text-white focus:border-green-500 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors cursor-pointer"
          >
            Update Password
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
