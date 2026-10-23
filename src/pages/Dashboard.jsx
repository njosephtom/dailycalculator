import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import PageSEO from "../components/ui/PageSEO";
import AdGrid from "../components/ads/AdGrid";
import { useFavorites } from "../context/FavoritesContext";

// ids match calculatorRegistry ids (usage docs are keyed by them)
const CALCULATORS = [
  { id: "compound-interest", name: "Compound Interest", path: "/finance/compound-interest" },
  { id: "simple-interest-calculator", name: "Simple Interest", path: "/finance/simple-interest-calculator" },
  { id: "savings-calculator", name: "Savings", path: "/finance/savings-calculator" },
  { id: "loan-calculator", name: "Loan", path: "/finance/loan-calculator" },
  { id: "bmi-calculator", name: "BMI", path: "/health/bmi-calculator" },
  { id: "age-calculator", name: "Age", path: "/time/age-calculator" },
  { id: "date-calculator", name: "Date", path: "/time/date-calculator" },
  { id: "time-zone-calculator", name: "Timezone", path: "/time/time-zone-calculator" },
  { id: "percentage-calculator", name: "Percentage", path: "/math/percentage-calculator" },
];

export default function Dashboard({ user, onSignOut }) {
  // favorites come from FavoritesProvider (already loaded in App) - no second user-doc read
  const { favorites, loading: favoritesLoading, toggleFavorite } = useFavorites();
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const loadUsage = async () => {
      try {
        // top 20 by count; only 9 are displayed
        const usageSnap = await getDocs(
          query(collection(db, "users", user.uid, "usage"), orderBy("count", "desc"), limit(20))
        );
        const usageMap = {};
        usageSnap.forEach((doc) => {
          usageMap[doc.id] = doc.data().count || 0;
        });
        setUsage(usageMap);
      } catch (err) {
        console.error("Error loading usage:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsage();
  }, [user]);

  if (loading || favoritesLoading) return <div className="text-center py-10">Loading...</div>;

  const favoriteCalcs = CALCULATORS.filter((c) => favorites.includes(c.id));
  // ponytail: sort by usage count (descending), calculators with 0 usage fall to end
  const sortedByUsage = [...CALCULATORS].sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0));

  return (
    <>
      <PageSEO
        title="My Dashboard"
        description="View your favorite calculators and most-used tools."
        path="/dashboard"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome, {user.displayName || "User"}!</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">Select your favorite calculators for quick access</p>
          </div>
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={20} className="text-red-500 fill-red-500" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your Favorites ({favorites.length})</h2>
        </div>
        {favoriteCalcs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {favoriteCalcs.map((calc) => (
              <button
                key={calc.id}
                onClick={() => navigate(calc.path)}
                className="inline-block text-sm px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
              >
                {calc.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm">Add calculators to your favorites to see them here!</p>
        )}
      </div>

      {/* Most Used Calculators */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📊 Most Used</h2>
        <div className="flex flex-wrap gap-2">
          {sortedByUsage.map((calc) => (
            <div key={calc.id} className="relative group">
              <button
                onClick={() => toggleFavorite(calc.id)}
                className="inline-block text-sm px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{calc.name}</span>
                {usage[calc.id] > 0 && (
                  <span className="ml-1 text-xs font-semibold">({usage[calc.id]})</span>
                )}
              </button>
              <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
                <Heart
                  size={16}
                  className={`${
                    favorites.includes(calc.id)
                      ? "text-red-500 fill-red-500"
                      : "text-slate-300 dark:text-slate-600"
                  } cursor-pointer`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AdSense - Below Content */}
      <AdGrid position="below-content" />
    </div>
    </>
  );
}
