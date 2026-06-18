/** Water Intake Calculator utilities */

/**
 * Activity level multipliers for water intake
 */
export const ACTIVITY_LEVELS = {
  sedentary:  { label: "Sedentary (little or no exercise)",     factor: 1.0  },
  light:      { label: "Lightly Active (1-3 days/week)",        factor: 1.0  },
  moderate:   { label: "Moderately Active (3-5 days/week)",     factor: 1.0  },
  active:     { label: "Very Active (6-7 days/week)",           factor: 1.0  },
  extra:      { label: "Extra Active (hard exercise + physical job)", factor: 1.0 },
};

/**
 * Climate adjustment multipliers
 */
export const CLIMATE_OPTIONS = {
  cool:    { label: "Cool / Temperate",   pct: 0.00 },
  warm:    { label: "Warm",               pct: 0.10 },
  hot:     { label: "Hot / Humid",        pct: 0.20 },
  veryHot: { label: "Very Hot / Tropical", pct: 0.30 },
};

/**
 * Pregnancy / breastfeeding options
 */
export const SPECIAL_OPTIONS = [
  { value: "none",          label: "No" },
  { value: "pregnant",      label: "Pregnant" },
  { value: "breastfeeding", label: "Breastfeeding" },
];

/** Convert lbs to kg */
export function lbsToKg(lbs) {
  return lbs * 0.453592;
}

/** Convert kg to lbs */
export function kgToLbs(kg) {
  return kg / 0.453592;
}

/** Convert liters to fl oz */
export function litersToOz(liters) {
  return liters * 33.814;
}

/** Convert fl oz to liters */
export function ozToLiters(oz) {
  return oz / 33.814;
}

/**
 * Calculate base water intake from weight
 * Formula: body weight (kg) x 0.033 liters
 * @param {number} weightKg - body weight in kilograms
 * @returns {number} base water in liters
 */
export function calcBaseIntake(weightKg) {
  return weightKg * 0.033;
}

/**
 * Calculate exercise water adjustment
 * +350 ml per 30 min of exercise
 * @param {number} exerciseMin - minutes of exercise per day
 * @returns {number} additional water in liters
 */
export function calcExerciseAdjustment(exerciseMin) {
  if (exerciseMin <= 0) return 0;
  return (exerciseMin / 30) * 0.35;
}

/**
 * Calculate climate adjustment
 * Applied as a percentage increase on base intake
 * @param {number} baseLiters - base intake in liters
 * @param {string} climateKey - key from CLIMATE_OPTIONS
 * @returns {number} additional water in liters
 */
export function calcClimateAdjustment(baseLiters, climateKey) {
  const pct = CLIMATE_OPTIONS[climateKey]?.pct ?? 0;
  return baseLiters * pct;
}

/**
 * Calculate pregnancy/breastfeeding adjustment
 * Pregnant: +300 ml, Breastfeeding: +700 ml
 * @param {string} specialKey - "none" | "pregnant" | "breastfeeding"
 * @returns {number} additional water in liters
 */
export function calcSpecialAdjustment(specialKey) {
  if (specialKey === "pregnant") return 0.3;
  if (specialKey === "breastfeeding") return 0.7;
  return 0;
}

/**
 * Full water intake calculation
 * @param {object} params
 * @param {number} params.weightKg
 * @param {string} params.climateKey
 * @param {number} params.exerciseMin
 * @param {string} params.specialKey
 * @returns {object} breakdown and totals
 */
export function calcWaterIntake({ weightKg, climateKey, exerciseMin, specialKey }) {
  const baseLiters       = calcBaseIntake(weightKg);
  const exerciseLiters   = calcExerciseAdjustment(exerciseMin);
  const climateLiters    = calcClimateAdjustment(baseLiters, climateKey);
  const specialLiters    = calcSpecialAdjustment(specialKey);

  const totalLiters = baseLiters + exerciseLiters + climateLiters + specialLiters;
  const totalOz     = litersToOz(totalLiters);

  // 1 glass = 8 oz
  const glasses8oz = totalOz / 8;
  // 1 bottle = 500 ml = 0.5 L
  const bottles500ml = totalLiters / 0.5;
  // Hourly intake spread over 16 waking hours
  const hourlyMl = (totalLiters * 1000) / 16;

  return {
    baseLiters,
    exerciseLiters,
    climateLiters,
    climatePct: CLIMATE_OPTIONS[climateKey]?.pct ?? 0,
    specialLiters,
    totalLiters,
    totalOz,
    glasses8oz:  Math.ceil(glasses8oz),
    bottles500ml: Math.ceil(bottles500ml),
    hourlyMl:    Math.round(hourlyMl),
  };
}
