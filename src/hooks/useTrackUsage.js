import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordUsage } from "../utils/usageTracker";

export function useTrackUsage(user) {
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Extract calculator ID from path patterns like /finance/compound-interest
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const calculatorId = parts.slice(1).join("-"); // e.g., "compound-interest"
      // Only track if path matches calculator pattern (has both category and calculator)
      if (parts[0] && parts[1]) {
        recordUsage(user.uid, calculatorId);
      }
    }
  }, [location.pathname, user]);
}
