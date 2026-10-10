// Month helpers. Months are "YYYY-MM" strings and expense dates are stored at UTC midnight,
// so all maths is done in UTC (which is also Ghana time).

export const currentMonth = () => new Date().toISOString().slice(0, 7);

// [start, end): the first day of the month (inclusive) to the first day of the next (exclusive).
export function monthRange(month: string) {
  const year = Number(month.slice(0, 4));
  const index = Number(month.slice(5, 7)) - 1;
  return { gte: new Date(Date.UTC(year, index, 1)), lt: new Date(Date.UTC(year, index + 1, 1)) };
}
