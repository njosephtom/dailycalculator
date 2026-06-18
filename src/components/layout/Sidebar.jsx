import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DollarSign, Calculator, ChefHat, Heart,
  ArrowLeftRight, Wrench, ChevronDown, ChevronRight, X,
} from "lucide-react";
import { calculatorRegistry, categoryMeta } from "../../data/calculatorRegistry";

const ICON_MAP = { DollarSign, Calculator, ChefHat, Heart, ArrowLeftRight, Wrench };

const COLOR = {
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", active: "text-emerald-700 dark:text-emerald-300" },
  indigo:  { icon: "text-indigo-600 dark:text-indigo-400",   bg: "bg-indigo-50 dark:bg-indigo-900/20",   active: "text-indigo-700 dark:text-indigo-300"  },
  orange:  { icon: "text-orange-500 dark:text-orange-400",   bg: "bg-orange-50 dark:bg-orange-900/20",   active: "text-orange-700 dark:text-orange-300"  },
  rose:    { icon: "text-rose-500 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-900/20",       active: "text-rose-700 dark:text-rose-300"      },
  blue:    { icon: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-900/20",       active: "text-blue-700 dark:text-blue-300"      },
  amber:   { icon: "text-amber-500 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-900/20",     active: "text-amber-700 dark:text-amber-300"    },
};

const CATEGORY_ORDER = ["finance", "math", "health", "cooking", "convert", "misc"];

const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
  acc[cat] = calculatorRegistry.filter((c) => c.category === cat);
  return acc;
}, {});

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const activeCategory = location.pathname.split("/")[1] || "";

  const [open, setOpen] = useState(() =>
    CATEGORY_ORDER.reduce((acc, cat) => {
      acc[cat] = cat === activeCategory;
      return acc;
    }, {})
  );

  useEffect(() => {
    const cat = location.pathname.split("/")[1] || "";
    if (cat && CATEGORY_ORDER.includes(cat)) {
      setOpen((prev) => ({ ...prev, [cat]: true }));
    }
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Mobile header */}
      {onClose && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 lg:hidden shrink-0">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-100">Calculators</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tree nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {CATEGORY_ORDER.map((cat) => {
          const meta = categoryMeta[cat];
          if (!meta) return null;

          const Icon = ICON_MAP[meta.icon];
          const c = COLOR[meta.color] || COLOR.indigo;
          const items = grouped[cat] || [];
          const isOpen = !!open[cat];
          const isCatActive = activeCategory === cat;

          return (
            <div key={cat}>
              {/* Category row */}
              <button
                onClick={() => setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors group ${
                  isCatActive
                    ? `${c.bg} ${c.active} font-semibold`
                    : "hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                }`}
              >
                {Icon && <Icon size={15} className={c.icon} />}
                <span className="flex-1 text-sm font-semibold tracking-tight">{meta.label}</span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                  {items.length}
                </span>
                {isOpen
                  ? <ChevronDown size={13} className="text-slate-400 shrink-0" />
                  : <ChevronRight size={13} className="text-slate-400 shrink-0" />
                }
              </button>

              {/* Calculator links */}
              {isOpen && (
                <div className="ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-700 mt-0.5 mb-1 space-y-0.5">
                  {items.map((calc) => {
                    const isActive = location.pathname === calc.path;
                    return (
                      <Link
                        key={calc.id}
                        to={calc.path}
                        onClick={onClose}
                        className={`block text-[13px] py-1.5 px-2 rounded-md transition-colors leading-snug ${
                          isActive
                            ? `${c.bg} ${c.active} font-medium`
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                        }`}
                      >
                        {calc.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
