import React, { useState } from "react";
import EarningCoinPopup from "../components/coin/EarningCoinPopup.jsx";

export default function PointsSandbox() {
  const [animationState, setAnimationState] = useState({
    show: false,
    points: 250,
  });
  const [isFrozen, setIsFrozen] = useState(false);

  // Trigger a standard 3-second simulation run
  const triggerSimulation = () => {
    setIsFrozen(false);
    setAnimationState({ show: true, points: 250 });
  };

  // Lock the component onto the screen so you can inspect CSS styling trees in DevTools
  const toggleFreezeState = (checked) => {
    setIsFrozen(checked);
    if (checked) {
      setAnimationState({ show: true, points: 250 });
    } else {
      setAnimationState({ show: false, points: 0 });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-zinc-900 flex flex-col items-center justify-center gap-6 p-8 relative">
      {/* Sandbox Control Interface Box */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md border dark:border-zinc-700 max-w-sm w-full text-center space-y-4 z-10">
        <h3 className="text-lg font-black text-gray-800 dark:text-white">
          ✨ Gamification Animation Rig
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Use these controls to adjust, verify, and slow down your Framer Motion
          transitions.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={triggerSimulation}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
          >
            🎬 Run Animation Test
          </button>

          <label className="flex items-center justify-center gap-3 p-2 bg-gray-50 dark:bg-zinc-900/40 rounded-xl cursor-pointer select-none border dark:border-zinc-700/50">
            <input
              type="checkbox"
              checked={isFrozen}
              onChange={(e) => toggleFreezeState(e.target.checked)}
              className="accent-emerald-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              ❄️ Freeze Component Open
            </span>
          </label>
        </div>
      </div>

      {/* 🟢 Render Target Popup Hook */}
      <EarningCoinPopup
        animationState={animationState}
        onClose={() => {
          // If the freeze toggle is checked, completely ignore the 3-second auto-close command!
          if (!isFrozen) {
            setAnimationState({ show: false, points: 0 });
          }
        }}
      />
    </div>
  );
}
