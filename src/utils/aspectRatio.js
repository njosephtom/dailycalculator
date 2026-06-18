/**
 * Greatest common divisor (Euclidean algorithm).
 */
export function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Returns a simplified ratio string like "16:9".
 */
export function simplifyRatio(w, h) {
  if (!w || !h || w <= 0 || h <= 0) return "—";
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

/**
 * Returns the decimal ratio (width / height).
 */
export function decimalRatio(w, h) {
  if (!w || !h || h <= 0) return 0;
  return w / h;
}

/**
 * Given original dimensions and a new width, returns the proportional new height.
 */
export function scaleByWidth(origW, origH, newW) {
  if (!origW || !origH || !newW || origW <= 0) return 0;
  return (origH / origW) * newW;
}

/**
 * Given original dimensions and a new height, returns the proportional new width.
 */
export function scaleByHeight(origW, origH, newH) {
  if (!origW || !origH || !newH || origH <= 0) return 0;
  return (origW / origH) * newH;
}

/**
 * Common aspect ratio presets with typical resolutions.
 */
export const COMMON_RATIOS = [
  { ratio: "16:9",  w: 16, h: 9,  resolutions: ["1920 x 1080", "2560 x 1440", "3840 x 2160"] },
  { ratio: "4:3",   w: 4,  h: 3,  resolutions: ["1024 x 768", "1600 x 1200", "2048 x 1536"] },
  { ratio: "21:9",  w: 21, h: 9,  resolutions: ["2560 x 1080", "3440 x 1440", "5120 x 2160"] },
  { ratio: "1:1",   w: 1,  h: 1,  resolutions: ["1080 x 1080", "1200 x 1200", "2048 x 2048"] },
  { ratio: "3:2",   w: 3,  h: 2,  resolutions: ["1440 x 960", "2160 x 1440", "6000 x 4000"] },
  { ratio: "9:16",  w: 9,  h: 16, resolutions: ["1080 x 1920", "1440 x 2560", "2160 x 3840"] },
];
