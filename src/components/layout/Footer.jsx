import React from "react";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const CATEGORIES = ["finance", "math", "cooking", "health", "convert"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={18} className="text-indigo-600" />
              <span className="font-bold text-slate-800 dark:text-white">CalcVault</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Free online calculators for finance, health, cooking, math, and unit conversions. Fast, accurate, and privacy-friendly.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Categories</h4>
            <ul className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/${cat}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 capitalize transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Legal</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CalcVault. All rights reserved. Results are for informational purposes only.
        </div>
      </div>
    </footer>
  );
}
