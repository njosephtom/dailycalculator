/** US Navy circumference method */
export function calcBodyFatNavy({ sex, heightCm, neckCm, waistCm, hipCm = 0 }) {
  const h = heightCm;
  const w = waistCm;
  const n = neckCm;
  const hi = hipCm;
  if (h <= 0 || w <= 0 || n <= 0) return null;
  if (sex === "female" && hi <= 0) return null;

  let bf;
  if (sex === "male") {
    bf = 86.01 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
  } else {
    bf = 163.205 * Math.log10(w + hi - n) - 97.684 * Math.log10(h) - 78.387;
  }
  return Math.max(0, bf);
}

export function bodyFatCategory(bf, sex) {
  if (!isFinite(bf) || bf < 0) return { label: "—", color: "slate" };
  if (sex === "male") {
    if (bf < 6)  return { label: "Essential Fat", color: "blue"    };
    if (bf < 14) return { label: "Athletic",      color: "green"   };
    if (bf < 18) return { label: "Fitness",       color: "emerald" };
    if (bf < 25) return { label: "Average",       color: "yellow"  };
    return             { label: "Obese",          color: "red"     };
  }
  if (bf < 14) return { label: "Essential Fat", color: "blue"    };
  if (bf < 21) return { label: "Athletic",      color: "green"   };
  if (bf < 25) return { label: "Fitness",       color: "emerald" };
  if (bf < 32) return { label: "Average",       color: "yellow"  };
  return             { label: "Obese",          color: "red"     };
}

export const BF_RANGES = {
  male:   [["Essential Fat","2–5%"],["Athletic","6–13%"],["Fitness","14–17%"],["Average","18–24%"],["Obese","25%+"]],
  female: [["Essential Fat","10–13%"],["Athletic","14–20%"],["Fitness","21–24%"],["Average","25–31%"],["Obese","32%+"]],
};
