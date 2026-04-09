/**
 * Types for the Interactive Wall Calendar
 */

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  rangeId?: string; // For range notes
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarState {
  selectedRange: DateRange;
  currentMonth: Date;
  theme: 'light' | 'dark';
  notes: Map<string, Note[]>;
}

export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  hasNotes: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
}

export interface ImageOption {
  url: string;
  title: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
