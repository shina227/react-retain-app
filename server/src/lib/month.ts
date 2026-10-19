// Month helpers. Months are "YYYY-MM" strings and expense dates are stored at UTC midnight,
// so all maths is done in UTC to keep dates from shifting with the server's time zone.

export const currentMonth = () => new Date().toISOString().slice(0, 7);

// [start, end): the first day of the month (inclusive) to the first day of the next (exclusive).
export function monthRange(month: string) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1;
  return { gte: new Date(Date.UTC(year, index, 1)), lt: new Date(Date.UTC(year, index + 1, 1)) };
}

// The month `delta` months away, e.g. shiftMonth("2026-01", -1) === "2025-12".
export function shiftMonth(month: string, delta: number) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1 + delta;
  return new Date(Date.UTC(year, index, 1)).toISOString().slice(0, 7);
}
