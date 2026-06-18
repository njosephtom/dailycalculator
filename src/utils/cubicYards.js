export const MATERIALS = {
  concrete:        { label: "Concrete",         lbPerCuYd: 4050 },
  topsoil:         { label: "Topsoil",           lbPerCuYd: 2200 },
  mulch:           { label: "Mulch",             lbPerCuYd:  800 },
  gravel:          { label: "Gravel",            lbPerCuYd: 2835 },
  sand:            { label: "Sand",              lbPerCuYd: 2700 },
  compost:         { label: "Compost",           lbPerCuYd: 1000 },
  decorative_stone:{ label: "Decorative Stone",  lbPerCuYd: 2700 },
  asphalt:         { label: "Asphalt",           lbPerCuYd: 4050 },
  other:           { label: "Other",             lbPerCuYd: null },
};

const SQ_FT = { sqft: 1, sqyd: 9, sqm: 10.7639 };
const DEPTH_FT = { inches: 1 / 12, cm: 1 / 30.48, feet: 1 };

export function calcFromDimensions({ lengthFt, widthFt, depth, depthUnit }) {
  const dFt = (parseFloat(depth) || 0) * (DEPTH_FT[depthUnit] ?? 1 / 12);
  const cubicFt = (parseFloat(lengthFt) || 0) * (parseFloat(widthFt) || 0) * dFt;
  return toCubic(cubicFt);
}

export function calcFromArea({ area, areaUnit, depth, depthUnit }) {
  const aFt = (parseFloat(area) || 0) * (SQ_FT[areaUnit] ?? 1);
  const dFt = (parseFloat(depth) || 0) * (DEPTH_FT[depthUnit] ?? 1 / 12);
  return toCubic(aFt * dFt);
}

function toCubic(cubicFt) {
  return {
    cubicFt,
    cubicYards:  cubicFt / 27,
    cubicMeters: cubicFt * 0.0283168,
  };
}

export function weightTons(cubicYards, material) {
  const lb = MATERIALS[material]?.lbPerCuYd;
  if (!lb) return null;
  return { lbs: cubicYards * lb, tons: (cubicYards * lb) / 2000 };
}
