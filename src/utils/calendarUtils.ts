/**
 * Calendar utility functions
 */

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday as isTodayDateFns,
  isBefore,
  isAfter,
  isEqual,
  format,
  getDay,
} from 'date-fns';
import { DayInfo, DateRange } from '@app-types/calendar';

/**
 * Expanded holidays with emoji and theme data
 */
interface HolidayInfo {
  name: string;
  emoji: string;
  color: string;     // primary glow color
  gradient: [string, string]; // gradient stops for the celebration effect
}

const HOLIDAYS: Record<string, HolidayInfo> = {
  '01-01': { name: "New Year's Day", emoji: '🎆', color: '#ffd700', gradient: ['#ffd700', '#ff6b35'] },
  '01-26': { name: 'Republic Day', emoji: '🇮🇳', color: '#ff9933', gradient: ['#ff9933', '#138808'] },
  '02-14': { name: "Valentine's Day", emoji: '💕', color: '#ff1493', gradient: ['#ff1493', '#ff69b4'] },
  '03-08': { name: "Women's Day", emoji: '💜', color: '#9b59b6', gradient: ['#9b59b6', '#e91e63'] },
  '03-17': { name: "St. Patrick's Day", emoji: '☘️', color: '#00c853', gradient: ['#00c853', '#1b5e20'] },
  '03-25': { name: 'Holi', emoji: '🎨', color: '#e91e63', gradient: ['#ff5722', '#9c27b0'] },
  '04-14': { name: 'Ambedkar Jayanti', emoji: '📘', color: '#1565c0', gradient: ['#1565c0', '#0d47a1'] },
  '05-01': { name: 'May Day', emoji: '✊', color: '#d32f2f', gradient: ['#d32f2f', '#b71c1c'] },
  '05-11': { name: "Mother's Day", emoji: '🌸', color: '#e91e63', gradient: ['#e91e63', '#f48fb1'] },
  '06-15': { name: "Father's Day", emoji: '👔', color: '#1976d2', gradient: ['#1976d2', '#42a5f5'] },
  '07-04': { name: 'Independence Day (US)', emoji: '🇺🇸', color: '#1565c0', gradient: ['#b71c1c', '#1565c0'] },
  '08-15': { name: 'Independence Day', emoji: '🇮🇳', color: '#ff9933', gradient: ['#ff9933', '#138808'] },
  '09-05': { name: "Teachers' Day", emoji: '📚', color: '#4caf50', gradient: ['#4caf50', '#2e7d32'] },
  '10-02': { name: 'Gandhi Jayanti', emoji: '🕊️', color: '#f5f5f5', gradient: ['#e0e0e0', '#9e9e9e'] },
  '10-24': { name: 'Dussehra', emoji: '🏹', color: '#ff5722', gradient: ['#ff5722', '#e65100'] },
  '10-31': { name: 'Halloween', emoji: '🎃', color: '#ff6d00', gradient: ['#ff6d00', '#4a148c'] },
  '11-01': { name: 'Diwali', emoji: '🪔', color: '#ffd700', gradient: ['#ffd700', '#ff6f00'] },
  '11-14': { name: "Children's Day", emoji: '🧒', color: '#03a9f4', gradient: ['#03a9f4', '#0288d1'] },
  '12-25': { name: 'Christmas', emoji: '🎄', color: '#2e7d32', gradient: ['#c62828', '#2e7d32'] },
  '12-31': { name: "New Year's Eve", emoji: '🥂', color: '#ffd700', gradient: ['#ffd700', '#ff8f00'] },
};

/**
 * Get all days to display in calendar view (including days from previous/next months)
 */
export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  let calendarStart = monthStart;
  while (getDay(calendarStart) !== 1) {
    calendarStart = new Date(calendarStart.getTime() - 24 * 60 * 60 * 1000);
  }

  let calendarEnd = monthEnd;
  while (getDay(calendarEnd) !== 0) {
    calendarEnd = new Date(calendarEnd.getTime() + 24 * 60 * 60 * 1000);
  }

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Check if date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const day = getDay(date);
  return day === 0 || day === 6;
}

/**
 * Get holiday name if date is a holiday
 */
export function getHoliday(date: Date): string | null {
  const monthDay = format(date, 'MM-dd');
  return HOLIDAYS[monthDay]?.name || null;
}

/**
 * Get full holiday info (name, emoji, colors)
 */
export function getHolidayInfo(date: Date): HolidayInfo | null {
  const monthDay = format(date, 'MM-dd');
  return HOLIDAYS[monthDay] || null;
}

/**
 * Get holiday emoji for a date
 */
export function getHolidayEmoji(date: Date): string | null {
  const monthDay = format(date, 'MM-dd');
  return HOLIDAYS[monthDay]?.emoji || null;
}

/**
 * Get holiday theme colors for a date
 */
export function getHolidayTheme(date: Date): { color: string; gradient: [string, string] } | null {
  const monthDay = format(date, 'MM-dd');
  const info = HOLIDAYS[monthDay];
  if (!info) return null;
  return { color: info.color, gradient: info.gradient };
}

/**
 * Get all holidays for a given month
 */
export function getMonthHolidays(date: Date): Map<string, string> {
  const holidays = new Map<string, string>();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  days.forEach((day) => {
    const holiday = getHoliday(day);
    if (holiday) {
      holidays.set(format(day, 'yyyy-MM-dd'), holiday);
    }
  });

  return holidays;
}

/**
 * Create DayInfo for rendering
 */
export function createDayInfo(
  date: Date,
  currentMonth: Date,
  selectedRange: DateRange,
  hasNotes: boolean
): DayInfo {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isToday = isTodayDateFns(date);
  const rStart = selectedRange.start;
  const rEnd = selectedRange.end;

  let isRangeStart = false;
  let isRangeEnd = false;
  let isInRange = false;

  if (rStart && rEnd) {
    isRangeStart = isEqual(date, rStart);
    isRangeEnd = isEqual(date, rEnd);
    isInRange =
      !isRangeStart &&
      !isRangeEnd &&
      isAfter(date, rStart) &&
      isBefore(date, rEnd);
  } else if (rStart) {
    isRangeStart = isEqual(date, rStart);
  }

  const isSelected = isRangeStart || isRangeEnd || isToday;

  return {
    date,
    isCurrentMonth,
    isToday,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isInRange,
    hasNotes,
    isWeekend: isWeekend(date),
    isHoliday: !!getHoliday(date),
  };
}

/**
 * Format date range for display
 */
export function formatDateRange(range: DateRange): string {
  if (!range.start) return 'Select date range';
  if (!range.end) return format(range.start, 'MMM d, yyyy');

  return `${format(range.start, 'MMM d')} - ${format(range.end, 'MMM d, yyyy')}`;
}

/**
 * Get date key for storage
 */
export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get range key for storage
 */
export function getRangeKey(range: DateRange): string {
  if (!range.start || !range.end) return '';
  return `${getDateKey(range.start)}_${getDateKey(range.end)}`;
}

/**
 * Parse date key back to Date
 */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get week days labels
 */
export function getWeekDaysLabels(): string[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(date, today);
}
