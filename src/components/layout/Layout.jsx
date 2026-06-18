import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PageSEO from "../ui/PageSEO";
import { calculatorRegistry, categoryMeta } from "../../data/calculatorRegistry";

function usePageSEO() {
  const { pathname } = useLocation();
  const calc = calculatorRegistry.find(c => c.path === pathname);
  if (calc) {
    return { title: calc.name, description: calc.description, path: calc.path };
  }
  const catKey = pathname.replace(/^\//, "");
  const cat = categoryMeta[catKey];
  if (cat) {
    return { title: `${cat.label} Calculators`, description: cat.description, path: pathname };
  }
  if (pathname === "/") {
    return { title: null, description: "Free online calculators for finance, health, math, cooking, tech, and everyday tools.", path: "/" };
  }
  return { title: "Calculator", description: null, path: pathname };
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seo = usePageSEO();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200 flex flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <Header />

      <div className="flex flex-1 w-full max-w-7xl mx-auto">

        {/* ── Desktop sidebar (left, sticky) ── */}
        <aside className="hidden lg:flex lg:flex-col w-56 xl:w-64 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* ── Mobile: backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Mobile: slide-in drawer ── */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 z-40 shadow-xl transform transition-transform duration-200 ease-in-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
          {/* Mobile menu toggle button */}
          <button
            className="lg:hidden mb-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open calculator menu"
          >
            <Menu size={15} />
            Browse Calculators
          </button>

          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
