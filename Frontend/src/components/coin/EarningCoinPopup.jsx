import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function EarningCoinPopup({ animationState, onClose }) {
  //images of the coin

  const coinFront =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/coinFront_y4qgvs.png";

  const coinBack =
    "https://res.cloudinary.com/ddkgrqekv/image/upload/coinBack_wcnpb3.png";


  useEffect(() => {
    if (animationState.show) {
      const timeout = setTimeout(() => onClose(), 3500); // Kept 500ms longer so they can admire both sides!
      return () => clearTimeout(timeout);
    }
  }, [animationState.show]);

  return (
    <AnimatePresence>
      {animationState.show && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[9999] overflow-hidden">
          {/* Backdrop screen shading overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.7, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white/95 dark:bg-zinc-900/95 border border-emerald-500/20 px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center backdrop-blur-md pointer-events-auto ring-4 ring-emerald-500/5"
          >
            {/* 🟢 NEW: 3D Double-Sided Coin Showcase Deck Wrapper */}
            <div className="w-24 h-24 relative" style={{ perspective: 1000 }}>
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* FRONT FACE: Nutri-Nuggets Core Logo Logo */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full overflow-hidden filter drop-shadow-[0_4px_10px_rgba(212,163,89,0.5)]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={coinFront}
                    alt="Nutri-Nuggets Coin Front"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* BACK FACE: "Every Healthy Habit Builds a Better You" Motto */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full overflow-hidden filter drop-shadow-[0_4px_10px_rgba(212,163,89,0.5)]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)", // Flips the back graphic so it faces outward on recovery turns
                  }}
                >
                  <img
                    src={coinBack}
                    alt="Nutri-Nuggets Coin Back"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <div>
              <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                + {animationState.points} Nutri Nuggets!
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
