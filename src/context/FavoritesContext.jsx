import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children, user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    // snapshot fires from the local cache first, then again when the server answers
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        setFavorites(snap.data()?.favorites || []);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading favorites:", err);
        setLoading(false);
      }
    );
  }, [user]);

  const toggleFavorite = async (calcId) => {
    const newFavs = favorites.includes(calcId)
      ? favorites.filter((id) => id !== calcId)
      : [...favorites, calcId];
    setFavorites(newFavs);

    if (!user) return; // Don't save if not logged in

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { favorites: newFavs }, { merge: true });
    } catch (err) {
      console.error("Error saving favorites:", err);
    }
  };

  const isFavorite = (calcId) => favorites.includes(calcId);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
