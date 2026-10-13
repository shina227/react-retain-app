import { todayISO } from '@/lib/format';

export type DatePreset = 'month' | '30d' | 'all';
type DateRange = { startDate: string; endDate: string };

export const datePresets: { id: DatePreset; label: string }[] = [
  { id: 'month', label: 'This month' },
  { id: '30d', label: 'Last 30D' },
  { id: 'all', label: 'All time' },
];

// Date-only maths in UTC, so no time zone or DST shift can move the day.
const shiftDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// "This month" is the whole calendar month; "Last 30D" ends today, inclusive.
export function presetRange(preset: DatePreset, today = todayISO()): DateRange {
  if (preset === 'all') return { startDate: '', endDate: '' };
  if (preset === '30d') return { startDate: shiftDays(today, -29), endDate: today };

  const [year, month] = today.split('-').map(Number) as [number, number];
  const lastDay = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
  return { startDate: `${today.slice(0, 7)}-01`, endDate: lastDay };
}

// Which preset the current range matches, or 'custom' for anything else.
export function activePreset({ startDate, endDate }: DateRange): DatePreset | 'custom' {
  const match = datePresets.find(({ id }) => {
    const range = presetRange(id);
    return range.startDate === startDate && range.endDate === endDate;
  });
  return match?.id ?? 'custom';
}
