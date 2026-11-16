import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  DollarSign, Calculator, ChefHat, Heart, Clock,
  ArrowLeftRight, Wrench, Monitor, FileText, ChevronLeft, ChevronRight, Menu, User,
} from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PageSEO from "../ui/PageSEO";
import CalculatorInfo from "./CalculatorInfo";
import AdSenseUnit from "../ads/AdSenseUnit";
import { calculatorRegistry, categoryMeta } from "../../data/calculatorRegistry";
import { useTrackUsage } from "../../hooks/useTrackUsage";
import { canSeeCategory } from "../../utils/pdfAccess";

const ICON_MAP = { DollarSign, Calculator, ChefHat, Heart, Clock, ArrowLeftRight, Wrench, Monitor, FileText };
const CATEGORY_ORDER = ["finance", "math", "time", "health", "cooking", "convert", "tech", "misc", "pdf"];

const APP_CATEGORY = {
  finance: "FinanceApplication",
  health: "HealthApplication",
  cooking: "LifestyleApplication",
};

// WebApplication + BreadcrumbList JSON-LD for each calculator (free, browser-based).
// The breadcrumb matches the visible one rendered above the calculator.
function calculatorSchema(calc) {
  const base = "https://www.converthub.wiki";
  const categoryName = categoryMeta[calc.category]?.label ?? calc.category;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: calc.name,
      description: calc.description,
      url: `${base}${calc.path}`,
      applicationCategory: APP_CATEGORY[calc.category] ?? "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: categoryName, item: `${base}/${calc.category}` },
        { "@type": "ListItem", position: 3, name: calc.name, item: `${base}${calc.path}` },
      ],
    },
  ];
}

function usePageSEO() {
  const { pathname } = useLocation();
  const calc = calculatorRegistry.find(c => c.path === pathname);
  if (calc) {
    return { title: calc.name, description: calc.description, path: calc.path, schema: calculatorSchema(calc) };
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
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const seo = usePageSEO();
  const calc = seo.schema ? calculatorRegistry.find((c) => c.path === seo.path) : null;
  const { pathname } = useLocation();
  const activeCategory = pathname.split("/")[1] || "";
  useTrackUsage(user);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200 flex flex-col">
      <PageSEO title={seo.title} description={seo.description} path={seo.path} schema={seo.schema} />
      <Header user={user} onSignIn={onSignIn} onSignOut={onSignOut} />

      {/* Top AdSense Banner */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-center py-2 overflow-x-auto">
        <AdSenseUnit slot="leaderboard" className="min-w-max min-h-[50px] md:min-h-[90px]" />
      </div>

      <div className="flex flex-1 w-full">

        {/* ── Mobile: persistent icon sidebar ── */}
        <aside className="lg:hidden flex flex-col items-center w-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-3 gap-1.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Sign In icon */}
          {!user && (
            <button
              onClick={onSignIn}
              className="p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Sign In"
              aria-label="Sign In"
            >
              <User size={18} />
            </button>
          )}

          {CATEGORY_ORDER.filter((cat) => canSeeCategory(cat, user)).map((cat) => {
            const meta = categoryMeta[cat];
            if (!meta) return null;
            const Icon = ICON_MAP[meta.icon];
            const isActive = activeCategory === cat;
            const colorClass = COLOR[meta.color] || COLOR.indigo;
            return Icon ? (
              <Link
                key={cat}
                to={meta.href ?? `/${cat}`}
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
          <Sidebar collapsed={desktopCollapsed} user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
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
          <Sidebar onClose={() => setSidebarOpen(false)} user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          {calc && (
            <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:underline">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link to={`/${calc.category}`} className="hover:underline">{categoryMeta[calc.category]?.label ?? calc.category}</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page">{calc.name}</li>
              </ol>
            </nav>
          )}
          <Outlet />
          {calc && <CalculatorInfo calc={calc} />}
        </main>
      </div>

      {/* Bottom AdSense Banner */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-center py-2 overflow-x-auto">
        <AdSenseUnit slot="leaderboard" className="min-w-max min-h-[50px] md:min-h-[90px]" />
      </div>

      <Footer />
    </div>
  );
}
