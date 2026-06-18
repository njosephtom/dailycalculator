// Grams per cup for common ingredients
const DENSITIES = {
  flour: 120,
  sugar: 200,
  butter: 227,
  water: 240,
};

// Volume units: conversion factor to milliliters
const TO_ML = {
  cups: 236.588,
  tablespoons: 14.787,
  teaspoons: 4.929,
  milliliters: 1,
  ounces: 29.574,
};

const VOLUME_UNITS = new Set(["cups", "tablespoons", "teaspoons", "milliliters", "ounces"]);

export function convertCooking(value, fromUnit, toUnit, ingredient = "water") {
  const density = DENSITIES[ingredient] ?? 240;
  const fromIsVol = VOLUME_UNITS.has(fromUnit);
  const toIsVol = VOLUME_UNITS.has(toUnit);

  if (fromIsVol && toIsVol) {
    return (value * TO_ML[fromUnit]) / TO_ML[toUnit];
  }
  if (!fromIsVol && !toIsVol) {
    return value;
  }
  if (fromIsVol && !toIsVol) {
    // volume → grams: convert to ml first, then ml→cups, then cups*density
    const ml = value * TO_ML[fromUnit];
    return (ml / TO_ML["cups"]) * density;
  }
  // grams → volume
  const cups = value / density;
  return (cups * TO_ML["cups"]) / TO_ML[toUnit];
}
