import { useSearchParams } from 'react-router';

// Months are "YYYY-MM" strings, matching the API's `month` param.

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const label = new Intl.DateTimeFormat('en-RW', { month: 'long', year: 'numeric' });

const toMonth = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const toDate = (month: string) => new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1);

// The local month, so it doesn't flip early or late around midnight UTC.
export const currentMonth = () => toMonth(new Date());

// Days left in the current month, today included: 14 Oct → 18.
export const daysLeftInMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return lastDay - today.getDate() + 1;
};

// "2026-01", -1 → "2025-12"
export const shiftMonth = (month: string, by: number) => {
  const date = toDate(month);
  date.setMonth(date.getMonth() + by);
  return toMonth(date);
};

// "2026-10" → "October 2026"
export const formatMonth = (month: string) => label.format(toDate(month));

// The month lives in `?month=`, so it survives a refresh and can be shared.
// A missing or malformed value falls back to the current month.
export function useMonthParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('month');
  const month = param && MONTH_PATTERN.test(param) ? param : currentMonth();

  const setMonth = (next: string) =>
    setSearchParams(
      (prev) => {
        prev.set('month', next);
        return prev;
      },
      { replace: true },
    );

  return [month, setMonth] as const;
}
