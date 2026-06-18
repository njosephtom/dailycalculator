import React from "react";
import { Link, useLocation } from "react-router-dom";
import { calculatorRegistry } from "../data/calculatorRegistry";
import { Clock, ArrowLeft, CheckCircle } from "lucide-react";

export default function ComingSoon() {
  const { pathname } = useLocation();
  const tool = calculatorRegistry.find((c) => c.path === pathname);

  // Suggest other live calculators in the same category
  const suggestions = tool
    ? calculatorRegistry.filter(
        (c) => c.category === tool.category && c.implemented && c.id !== tool.id
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4">
          <Clock size={26} className="text-indigo-500" />
        </div>

        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          {tool?.name ?? "Calculator Coming Soon"}
        </h1>

        {tool?.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            {tool.description}
          </p>
        )}

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full text-xs font-medium text-amber-700 dark:text-amber-400">
          <Clock size={12} />
          This calculator is currently in development
        </div>

        {tool?.subcategory && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Category: <span className="capitalize font-medium">{tool.subcategory}</span>
          </p>
        )}

        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            to={tool ? `/${tool.category}` : "/"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to {tool?.category ?? "Home"}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            All Calculators
          </Link>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" />
            Available now in {tool?.category}
          </h2>
          <div className="grid gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                to={s.path}
                className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {s.name}
                </span>
                <ArrowLeft size={13} className="rotate-180 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
