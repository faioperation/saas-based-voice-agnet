import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <div
      onClick={toggle}
      className={`relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Animated white circle */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-black transition-all duration-300 z-30 ${dark ? "translate-x-8" : "translate-x-0"}`}
      >
        {dark ? <FiMoon size={16} /> : <FiSun size={16} />}
      </div>

      {/* Decorative gradient glow (optional) */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${dark ? "opacity-50 bg-gradient-to-r from-orange-500 to-red-600" : "opacity-0"}`}
      ></div>
    </div>
  );
}
