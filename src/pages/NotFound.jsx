import React from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import PageSEO from "../components/ui/PageSEO";

export default function NotFound() {
  return (
    <>
      <PageSEO title="Page not found" description="This page does not exist on ConvertHub." path="/" noindex />
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
          <SearchX size={26} className="text-slate-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Page not found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link to="/" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            All Calculators
          </Link>
          <Link to="/about" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            About ConvertHub
          </Link>
        </div>
      </div>
    </>
  );
}
