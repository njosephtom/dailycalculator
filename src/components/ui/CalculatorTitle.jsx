import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

export default function CalculatorTitle({ calculatorId, title, description }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(calculatorId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(calculatorId);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <button
          onClick={handleClick}
          className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 mt-1"
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={20}
            className={isFav ? "text-red-500 fill-red-500" : "text-slate-300 dark:text-slate-600"}
          />
        </button>
      </div>
    </div>
  );
}
