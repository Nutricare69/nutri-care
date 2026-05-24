import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Community() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="community"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold text-gray-800">Community</h3>
        <div
          className="bg-white rounded-3xl p-8 shadow-lg"
          style={{
            boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
          }}
        >
          <p className="text-gray-600 text-center py-8">
            Community features coming soon!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
