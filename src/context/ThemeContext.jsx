import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [userChosen, setUserChosen] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") !== null
  );

  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored !== null) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    if (userChosen) localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark, userChosen]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function handler(e) {
      if (!userChosen) setDark(e.matches);
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [userChosen]);

  const toggle = () => {
    setUserChosen(true);
    setDark((d) => !d);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
