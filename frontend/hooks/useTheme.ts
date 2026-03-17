"use client";
import { useState, useEffect } from "react";
 
export function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
 
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored !== null) {
      setDarkMode(stored === "dark");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);
 
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
 
  const toggleDark = () => setDarkMode((prev) => !prev);
 
  return { darkMode, toggleDark };
}
 