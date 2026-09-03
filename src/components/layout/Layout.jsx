import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  DollarSign, Calculator, ChefHat, Heart, Clock,
  ArrowLeftRight, Wrench, Monitor, ChevronLeft, ChevronRight,
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

const COLOR = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  orange: "text-orange-500 dark:text-orange-400",
  rose: "text-rose-500 dark:text-rose-400",
  blue: "text-blue-600 dark:text-blue-400",
  amber: "text-amber-500 dark:text-amber-400",
  violet: "text-violet-600 dark:text-violet-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
};

export default function Layout({ user, onSignIn, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(true);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
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
        <aside className={`lg:hidden flex flex-col items-center bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-3 gap-1.5 transition-all ${
          mobileExpanded ? "w-16" : "w-12"
        }`}>
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={mobileExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {mobileExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {CATEGORY_ORDER.map((cat) => {
            const meta = categoryMeta[cat];
            if (!meta) return null;
            const Icon = ICON_MAP[meta.icon];
            const isActive = activeCategory === cat;
            const colorClass = COLOR[meta.color] || COLOR.indigo;
            return Icon ? (
              <Link
                key={cat}
                to={`/${cat}`}
                className={`p-2.5 rounded-lg transition-colors ${
                  isActive
                    ? `${colorClass} bg-slate-100 dark:bg-slate-700`
                    : `${colorClass} hover:bg-slate-100 dark:hover:bg-slate-700`
                }`}
                title={meta.label}
                aria-label={meta.label}
              >
                <Icon size={18} />
              </Link>
            ) : null;
          })}
        </aside>

        {/* ── Desktop sidebar (left, sticky) ── */}
        <aside className={`hidden lg:flex lg:flex-col shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all ${
          desktopCollapsed ? "w-16" : "w-56 xl:w-64"
        }`}>
          <div className="flex items-center justify-between px-2 py-3 border-b border-slate-200 dark:border-slate-700">
            {!desktopCollapsed && <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Categories</span>}
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
              aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {desktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          <Sidebar collapsed={desktopCollapsed} />
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
