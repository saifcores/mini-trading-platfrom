/** Normalize Jackson `BigDecimal` / `Long` (sometimes strings) to finite numbers. */
export function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return Number.NaN;
}
