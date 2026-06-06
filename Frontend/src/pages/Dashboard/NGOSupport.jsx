import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../components/theme.js";

export default function NgoSupport() {
  const { isDark } = useTheme();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ngo"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">NGO Support</h3>
        <div
          className="bg-white dark:bg-[#0c130d] dark:border dark:border-green-950/20 rounded-3xl p-8 shadow-lg"
          style={{
            boxShadow: isDark
              ? "4px 4px 16px rgba(0, 0, 0, 0.4)"
              : "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
          }}
        >
          <p className="text-gray-600 dark:text-zinc-400 text-center py-8">
            NGO Support features coming soon!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
