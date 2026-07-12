import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

export default function EarningCoinPopup({ animationState, onClose }) {
  useEffect(() => {
    if (animationState.show) {
      const timeout = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [animationState.show]);

  return (
    <AnimatePresence>
      {animationState.show && (
        // 🟢 FIXED: Swapped 'absolute' for 'fixed inset-0 z-[9999]'
        // This ensures the animation instantly bypasses all modal gates and sits right on top!
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-9999 overflow-hidden">
          {/* Subtle localized glow ring overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none"
          />

          <motion.div
            // Smooth, luxurious float speeds
            initial={{ scale: 0.7, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white/95 dark:bg-zinc-900/95 border border-emerald-500/20 px-8 py-5 rounded-3xl shadow-2xl flex flex-col items-center gap-2 max-w-xs text-center backdrop-blur-md pointer-events-auto ring-4 ring-emerald-500/5 animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            {/* Spinning Coin Icon */}
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ repeat: 1, duration: 1.2, ease: "easeInOut" }}
              className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-full shadow-md"
            >
              <Coins className="w-10 h-10 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]" />
            </motion.div>

            <div>
              <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                + {animationState.points} Nutri Points
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 leading-none">
                Wallet Balance Updated!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
