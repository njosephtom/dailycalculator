/** Calorie Deficit Calculator utilities */

/**
 * Mifflin-St Jeor BMR equation
 * Male:   10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calcBMR(weightKg, heightCm, age, sex) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export const ACTIVITY_LEVELS = {
  sedentary:  { label: "Sedentary (little or no exercise)",     factor: 1.2   },
  light:      { label: "Lightly Active (1-3 days/week)",        factor: 1.375 },
  moderate:   { label: "Moderately Active (3-5 days/week)",     factor: 1.55  },
  active:     { label: "Very Active (6-7 days/week)",           factor: 1.725 },
  extra:      { label: "Extra Active (hard exercise + physical job)", factor: 1.9 },
};

/**
 * Calculate TDEE from BMR and activity level key
 */
export function calcTDEE(bmr, activityKey) {
  const factor = ACTIVITY_LEVELS[activityKey]?.factor ?? 1.55;
  return bmr * factor;
}

/**
 * Minimum safe daily calories
 */
export function minSafeCalories(sex) {
  return sex === "male" ? 1500 : 1200;
}

/**
 * Build a deficit plan
 * @param {number} tdee - maintenance calories
 * @param {number} dailyDeficit - calorie deficit per day (e.g. 500 or 1000)
 * @param {number} weightToLoseKg - total weight to lose in kg
 * @param {string} sex - "male" or "female"
 * @returns {{ dailyCals: number, weeksToGoal: number, belowMinimum: boolean }}
 */
export function buildPlan(tdee, dailyDeficit, weightToLoseKg, sex) {
  const dailyCals = Math.round(tdee - dailyDeficit);
  const minimum = minSafeCalories(sex);
  const belowMinimum = dailyCals < minimum;

  // 1 kg of fat ≈ 7700 kcal
  const totalDeficitNeeded = weightToLoseKg * 7700;
  const weeksToGoal = totalDeficitNeeded > 0
    ? Math.ceil(totalDeficitNeeded / (dailyDeficit * 7))
    : 0;

  return { dailyCals, weeksToGoal, belowMinimum };
}

/**
 * Macronutrient breakdown for a given calorie target
 * Protein 30%, Carbs 40%, Fat 30%
 * Protein/Carbs = 4 cal/g, Fat = 9 cal/g
 */
export function calcMacros(calories) {
  const proteinCals = calories * 0.3;
  const carbCals    = calories * 0.4;
  const fatCals     = calories * 0.3;

  return {
    protein: Math.round(proteinCals / 4),
    carbs:   Math.round(carbCals / 4),
    fat:     Math.round(fatCals / 9),
  };
}

/** Convert lbs to kg */
export function lbsToKg(lbs) {
  return lbs * 0.453592;
}

/** Convert kg to lbs */
export function kgToLbs(kg) {
  return kg / 0.453592;
}

/** Convert feet + inches to cm */
export function ftInToCm(ft, inches) {
  return (ft * 12 + inches) * 2.54;
}
