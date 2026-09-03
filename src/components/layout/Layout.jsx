import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  DollarSign, Calculator, ChefHat, Heart, Clock,
  ArrowLeftRight, Wrench, Monitor,
} from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PageSEO from "../ui/PageSEO";
import { calculatorRegistry, categoryMeta } from "../../data/calculatorRegistry";
import { useTrackUsage } from "../../hooks/useTrackUsage";

const ICON_MAP = { DollarSign, Calculator, ChefHat, Heart, Clock, ArrowLeftRight, Wrench, Monitor };
const CATEGORY_ORDER = ["finance", "math", "time", "health", "cooking", "convert", "tech", "misc"];

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

export default function Layout({ user, onSignIn, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const seo = usePageSEO();
  const { pathname } = useLocation();
  const activeCategory = pathname.split("/")[1] || "";
  useTrackUsage(user);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200 flex flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} />
      <Header user={user} onSignIn={onSignIn} onSignOut={onSignOut} />

      <div className="flex flex-1 w-full">

        {/* ── Mobile: persistent icon sidebar ── */}
        <aside className="lg:hidden flex flex-col items-center w-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-4 gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const meta = categoryMeta[cat];
            if (!meta) return null;
            const Icon = ICON_MAP[meta.icon];
            const isActive = activeCategory === cat;
            return Icon ? (
              <Link
                key={cat}
                to={`/${cat}`}
                className={`p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                title={meta.label}
                aria-label={meta.label}
              >
                <Icon size={20} />
              </Link>
            ) : null;
          })}
        </aside>

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
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
