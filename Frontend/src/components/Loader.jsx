import React from "react";

export default function Loader({ inline = false }) {
  return (
    <div
      className={
        inline
          ? "w-full min-h-[300px] flex items-center justify-center py-12" // Confined space for dashboard tabs
          : "fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 z-50" // Full screen for login/signup
      }
    >
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
