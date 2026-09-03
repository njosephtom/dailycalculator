import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { recordUsage } from "../utils/usageTracker";

const CALCULATORS = [
  { id: "compound-interest", name: "Compound Interest", category: "finance" },
  { id: "simple-interest", name: "Simple Interest", category: "finance" },
  { id: "savings-calculator", name: "Savings", category: "finance" },
  { id: "loan-calculator", name: "Loan", category: "finance" },
  { id: "bmi-calculator", name: "BMI", category: "health" },
  { id: "age-calculator", name: "Age", category: "misc" },
  { id: "date-calculator", name: "Date", category: "misc" },
  { id: "timezone-calculator", name: "Timezone", category: "time" },
  { id: "percentage-calculator", name: "Percentage", category: "math" },
];

export default function Dashboard({ user, onSignOut }) {
  const [favorites, setFavorites] = useState([]);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadFavoritesAndUsage();
  }, [user]);

  const loadFavoritesAndUsage = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFavorites(docSnap.data().favorites || []);
      }

      // Load usage data
      const usageCol = collection(db, "users", user.uid, "usage");
      const usageSnap = await getDocs(usageCol);
      const usageMap = {};
      usageSnap.forEach((doc) => {
        usageMap[doc.id] = doc.data().count || 0;
      });
      setUsage(usageMap);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (calcId) => {
    const newFavs = favorites.includes(calcId)
      ? favorites.filter((id) => id !== calcId)
      : [...favorites, calcId];
    setFavorites(newFavs);

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { favorites: newFavs }, { merge: true });
    } catch (err) {
      console.error("Error saving favorites:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const favoriteCalcs = CALCULATORS.filter((c) => favorites.includes(c.id));
  // ponytail: sort by usage count (descending), calculators with 0 usage fall to end
  const sortedByUsage = [...CALCULATORS].sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0));

  return (
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
                onClick={() => navigate(`/${calc.category}/${calc.id}`)}
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
    </div>
  );
}
