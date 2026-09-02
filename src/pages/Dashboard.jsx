import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFavorites(docSnap.data().favorites || []);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
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
  const otherCalcs = CALCULATORS.filter((c) => !favorites.includes(c.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.displayName || "User"}!</h1>
            <p className="text-gray-600 mt-1">Select your favorite calculators for quick access</p>
          </div>
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Favorites Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ Your Favorites ({favorites.length})</h2>
          {favoriteCalcs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteCalcs.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => navigate(`/${calc.category}/${calc.id}`)}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition text-left border-2 border-yellow-400"
                >
                  <div className="text-lg font-semibold text-gray-900">{calc.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{calc.category}</div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Add calculators to your favorites to see them here!</p>
          )}
        </div>

        {/* Available Calculators */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CALCULATORS.map((calc) => (
              <div
                key={calc.id}
                className={`p-3 rounded-lg border-2 transition ${
                  favorites.includes(calc.id)
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleFavorite(calc.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{calc.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{calc.category}</div>
                    </div>
                    <span className="text-lg">{favorites.includes(calc.id) ? "⭐" : "☆"}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
