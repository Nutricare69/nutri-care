import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "./theme.js";

/**
 * AutoSelect — A premium custom dropdown component.
 *
 * Props:
 * - name: string           (mirrors native select `name`)
 * - value: string          (controlled value)
 * - onChange: function     (called with a synthetic-like event: { target: { name, value } })
 * - options: Array<{ value: string, label: string }>
 * - label: string          (optional — rendered above the select)
 * - placeholder: string    (optional — shown when no value selected)
 * - required: bool
 * - disabled: bool
 * - className: string      (extra wrapper class)
 */
export default function AutoSelect({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { isDark } = useTheme();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel =
    options.find((o) => String(o.value) === String(value))?.label ??
    placeholder;

  const handleSelect = (optValue) => {
    onChange({ target: { name, value: optValue } });
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger button */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        whileTap={{ scale: 0.99 }}
        className={`
          w-full flex items-center justify-between gap-2
          px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left
          ${
            open
              ? "border-green-500 ring-2 ring-green-500/20"
              : "border-gray-200 dark:border-zinc-700 hover:border-green-400 dark:hover:border-green-700"
          }
          bg-white dark:bg-zinc-900/60
          text-gray-900 dark:text-white
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={
            value
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-zinc-500"
          }
        >
          {selectedLabel}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-400 dark:text-zinc-400"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>

      {/* Hidden native input for form validation */}
      {required && (
        <input
          tabIndex={-1}
          name={name}
          value={value}
          onChange={() => {}}
          required={required}
          className="sr-only"
          aria-hidden
        />
      )}

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-[200] w-full mt-1 rounded-xl overflow-y-auto max-h-60
              shadow-xl border
              ${
                isDark
                  ? "bg-[#0f1d13] border-green-900/40 shadow-black/50"
                  : "bg-white border-gray-100 shadow-gray-200/80"
              }
            `}
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <motion.li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  whileHover={{
                    backgroundColor: isDark
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(34,197,94,0.08)",
                  }}
                  className={`
                    flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm
                    transition-colors duration-100
                    ${
                      isSelected
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : "text-gray-700 dark:text-zinc-300"
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      <Check className="w-4 h-4" />
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
