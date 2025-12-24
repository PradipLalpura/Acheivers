
import { format, getDayOfYear, isAfter, startOfDay, getYear } from 'date-fns';

export const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

export const formatDateDisplay = (date: Date) => {
  const dayName = format(date, 'EEEE');
  const fullDate = format(date, 'd MMMM yyyy');
  const dayOfYear = getDayOfYear(date);
  const totalDays = 365 + (getYear(date) % 4 === 0 ? 1 : 0);
  return `${dayName} · ${fullDate} · Day ${dayOfYear} of ${totalDays}`;
};

export const isFuture = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = startOfDay(new Date());
  return isAfter(startOfDay(date), today);
};

export const getRelativeDateStr = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return format(d, 'yyyy-MM-dd');
};
