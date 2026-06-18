export function calculateBMI({ weightKg, heightCm }) {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

export function bmiCategory(bmi) {
  if (!isFinite(bmi) || bmi <= 0) return { label: "—", color: "slate" };
  if (bmi < 18.5) return { label: "Underweight", color: "blue" };
  if (bmi < 25) return { label: "Normal Weight", color: "green" };
  if (bmi < 30) return { label: "Overweight", color: "yellow" };
  return { label: "Obese", color: "red" };
}

// Mifflin-St Jeor equation
export function calculateBMR({ weightKg, heightCm, age, sex }) {
  if (sex === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

export const activityMultipliers = {
  sedentary: { label: "Sedentary (little or no exercise)", factor: 1.2 },
  light: { label: "Light (1–3 days/week)", factor: 1.375 },
  moderate: { label: "Moderate (3–5 days/week)", factor: 1.55 },
  active: { label: "Active (6–7 days/week)", factor: 1.725 },
  very_active: { label: "Very Active (hard exercise + physical job)", factor: 1.9 },
};
