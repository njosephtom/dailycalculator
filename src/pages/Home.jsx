import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Calculator, ChefHat, Heart, ArrowLeftRight } from "lucide-react";
import { calculatorRegistry, categoryMeta } from "../data/calculatorRegistry";

const ICON_MAP = { DollarSign, Calculator, ChefHat, Heart, ArrowLeftRight };

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Universal Calculator Suite</h1>
        <p className="text-indigo-200 text-sm leading-relaxed max-w-lg">
          Free, fast, and accurate calculators for finance, health, cooking, math, and unit
          conversions — all in one place.
        </p>
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {Object.entries(categoryMeta).map(([catKey, meta]) => {
          const Icon = ICON_MAP[meta.icon] ?? Calculator;
          const tools = calculatorRegistry.filter((c) => c.category === catKey);
          return (
            <div
              key={catKey}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mt-0.5 shrink-0">
                  <Icon size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <Link
                    to={`/${catKey}`}
                    className="font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {meta.label}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meta.description}</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2 pl-11">
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      className="inline-block text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
