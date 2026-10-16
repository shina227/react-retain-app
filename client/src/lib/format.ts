// Money travels as an integer count of the currency's smallest unit; dates as YYYY-MM-DD.
// The currency is Rwandan francs, which have no subunit, so that unit is the franc itself.

const LOCALE = 'en-RW';
export const CURRENCY = 'RWF';

const money = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY });
const date = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });

// Decimals the currency uses (0 for RWF, 2 for e.g. GHS), so switching currency is one line.
const DECIMALS = money.resolvedOptions().maximumFractionDigits ?? 0;
const UNITS_PER_MAJOR = 10 ** DECIMALS;

// 12550 → "RF 12,550"
export const formatMoney = (minor: number) => money.format(minor / UNITS_PER_MAJOR);

// Form input → stored integer: "12550" → 12550. Rounding also absorbs float noise
// in currencies with decimals (0.29 * 100 = 28.999…).
export const toMinor = (input: string | number) => Math.round(Number(input) * UNITS_PER_MAJOR);

// Stored integer → form input, for prefilling the amount when editing: 12550 → "12550".
export const fromMinor = (minor: number) => (minor / UNITS_PER_MAJOR).toFixed(DECIMALS);

// new Date('2026-10-12') is UTC midnight, which shows as the previous day anywhere west of
// Greenwich. With a time and no zone, the date is read as local midnight instead.
export const parseISODate = (value: string) => new Date(`${value}T00:00:00`);

// "2026-10-12" → "12 Oct 2026"
export const formatDate = (value: string) => date.format(parseISODate(value));

const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

// ISO timestamp (createdAt, updatedAt) → "12 Oct 2026, 09:30"
export const formatDateTime = (value: string) => dateTime.format(new Date(value));

// Today's local date as YYYY-MM-DD (toISOString would give the UTC date).
export const todayISO = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

const weekday = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

// Day-group headings: "Today", "Yesterday", otherwise "Sat, 10 Oct" (with the year if not this year).
export const formatDayLabel = (value: string) => {
  const day = parseISODate(value);
  const today = parseISODate(todayISO());
  const daysAgo = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return day.getFullYear() === today.getFullYear() ? weekday.format(day) : formatDate(value);
};

const compactMoney = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  notation: 'compact',
});

// 120000 → "RF 120K", for chart axes where space is tight.
export const formatMoneyCompact = (minor: number) => compactMoney.format(minor / UNITS_PER_MAJOR);
