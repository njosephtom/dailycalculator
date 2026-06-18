import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calculator, Moon, Sun, Search, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCalculatorRegistry } from "../../context/CalculatorRegistryContext";

export default function Header() {
  const { dark, toggle } = useTheme();
  const { searchQuery, setSearchQuery, filteredResults } = useCalculatorRegistry();
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const isMac = useMemo(() =>
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform), []
  );

  useEffect(() => { setActiveIndex(-1); }, [searchQuery]);

  useEffect(() => {
    function handleGlobalKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0) {
      document.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const showDropdown = focused && searchQuery.trim().length > 0;

  function handleSelect(path) {
    setSearchQuery("");
    setFocused(false);
    setActiveIndex(-1);
    navigate(path);
  }

  function handleInputKeyDown(e) {
    if (!showDropdown) {
      if (e.key === "Escape") { inputRef.current?.blur(); }
      return;
    }
    const max = filteredResults.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, max));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredResults[activeIndex]) {
          handleSelect(filteredResults[activeIndex].path);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchQuery("");
        setFocused(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="CalcVault Home">
          <Calculator className="text-indigo-600 dark:text-indigo-400" size={22} />
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            CalcVault
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleInputKeyDown}
            placeholder={`Search calculators… (${isMac ? "⌘" : "Ctrl+"}K)`}
            aria-label="Search calculators"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}

          {showDropdown && (
            <ul
              role="listbox"
              className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden z-50 max-h-72 overflow-y-auto"
            >
              {filteredResults.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No results found.</li>
              ) : (
                filteredResults.map((calc, index) => (
                  <li key={calc.id} role="option" aria-selected={index === activeIndex}>
                    <button
                      onMouseDown={() => handleSelect(calc.path)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        index === activeIndex
                          ? "bg-indigo-50 dark:bg-indigo-900/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="font-medium text-slate-800 dark:text-white">{calc.name}</span>
                      <span className="ml-2 text-xs text-slate-400 capitalize">{calc.category}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-slate-500" />
          }
        </button>
      </div>
    </header>
  );
}
