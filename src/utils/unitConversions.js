// toBase: multiplier to convert unit → base (meters for length, kg for weight)
export const lengthUnits = {
  mm:   { label: "Millimeters (mm)", toBase: 0.001 },
  cm:   { label: "Centimeters (cm)", toBase: 0.01 },
  m:    { label: "Meters (m)",       toBase: 1 },
  km:   { label: "Kilometers (km)",  toBase: 1000 },
  inch: { label: "Inches (in)",      toBase: 0.0254 },
  feet: { label: "Feet (ft)",        toBase: 0.3048 },
  yard: { label: "Yards (yd)",       toBase: 0.9144 },
  mile: { label: "Miles (mi)",       toBase: 1609.344 },
};

export const weightUnits = {
  mg:    { label: "Milligrams (mg)", toBase: 0.000001 },
  g:     { label: "Grams (g)",       toBase: 0.001 },
  kg:    { label: "Kilograms (kg)",  toBase: 1 },
  lb:    { label: "Pounds (lb)",     toBase: 0.453592 },
  oz:    { label: "Ounces (oz)",     toBase: 0.0283495 },
  stone: { label: "Stone (st)",      toBase: 6.35029 },
};

export function convert(value, fromUnit, toUnit, unitMap) {
  const base = value * unitMap[fromUnit].toBase;
  return base / unitMap[toUnit].toBase;
}
