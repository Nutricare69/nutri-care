import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("system");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-800">Settings</h3>

      {/* Theme Settings */}
      <div
        className="bg-white rounded-3xl p-8 shadow-lg"
        style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}
      >
        <h4 className="text-lg font-bold text-gray-800 mb-4">Theme Mode</h4>
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
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  theme === themeOption.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    theme === themeOption.id
                      ? "text-green-500"
                      : "text-gray-600"
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
        className="bg-white rounded-3xl p-8 shadow-lg"
        style={{ boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f" }}
      >
        <h4 className="text-lg font-bold text-gray-800 mb-4">
          Change Password
        </h4>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
          >
            Update Password
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
