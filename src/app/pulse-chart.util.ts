export const CHART = {
  width: 400,
  height: 200,
  padLeft: 30,
  padRight: 6,
  padTop: 10,
  padBottom: 18,
} as const;

export const plotWidth = CHART.width - CHART.padLeft - CHART.padRight;
export const plotHeight = CHART.height - CHART.padTop - CHART.padBottom;

export function xAt(index: number, count: number) {
  if (count <= 1) return CHART.padLeft;
  return CHART.padLeft + (index / (count - 1)) * plotWidth;
}

export function yAt(value: number, domainMax: number) {
  const clamped = Math.max(0, Math.min(value, domainMax));
  return CHART.padTop + plotHeight - (clamped / domainMax) * plotHeight;
}

/** Nearest data index for a 0..1 fraction across the plot width — used to drive hover tooltips. */
export function indexFromFraction(fraction: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.round(fraction * (count - 1))));
}

/** Rounds a peak up to a readable axis maximum (100, 250, 500, 1000, …). */
export function niceTicks(peak: number) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(peak, 1)));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * magnitude;
    if (candidate >= peak) return candidate;
  }
  return magnitude * 10;
}
