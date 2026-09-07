export function calculatePercentage(value: number, percent: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(percent)) return 0;
  return value * percent / 100;
}

export function percentageChange(from: number, to: number): number {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return 0;
  return ((to - from) / Math.abs(from)) * 100;
}
