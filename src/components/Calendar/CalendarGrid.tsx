/**
 * CalendarGrid Component - Premium glassmorphic calendar grid with staggered entry
 */

'use client';

import React, { useMemo } from 'react';
import { getCalendarDays, createDayInfo, getWeekDaysLabels } from '@utils/calendarUtils';
import { getMonthTheme } from '@utils/imageUtils';
import { DayCell } from './DayCell';
import { DateRange } from '@app-types/calendar';
import { Note } from '@app-types/calendar';

interface CalendarGridProps {
  currentMonth: Date;
  selectedRange: DateRange;
  monthNotes: Note[];
  favorites: string[];
  reminders: Record<string, string>;
  rangeNote?: Note | null;
  onDateClick: (date: Date) => void;
  onToggleFavorite?: (dateIso: string) => void;
  onSetReminder?: (dateIso: string, text: string) => void;
  isDarkTheme?: boolean;
  disablePastDates?: boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedRange,
  monthNotes,
  onDateClick,
  onToggleFavorite,
  onSetReminder,
  favorites,
  reminders,
  rangeNote,
  isDarkTheme = false,
  disablePastDates = false,
}) => {
  const monthTheme = getMonthTheme(currentMonth.getMonth());

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  const daysInfo = useMemo(
    () =>
      calendarDays.map((date) => {
        const dateKey = date.toISOString().split('T')[0];
        const hasNotes = monthNotes.some(n => n.date === dateKey);
        return createDayInfo(date, currentMonth, selectedRange, hasNotes);
      }),
    [calendarDays, currentMonth, selectedRange, monthNotes]
  );

  const weekDaysLabels = useMemo(() => getWeekDaysLabels(), []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate animation key to re-trigger staggered entry on month changes
  const gridKey = `${currentMonth.getMonth()}-${currentMonth.getFullYear()}`;

  return (
    <div className="w-full" key={gridKey}>
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {weekDaysLabels.map((day) => (
          <div
            key={day}
            className="text-center py-2"
          >
            <span
              className="font-heading text-xs font-semibold uppercase tracking-[0.15em]"
              style={{
                color: isDarkTheme ? monthTheme.textSecondary : monthTheme.accentGradient[0],
                opacity: 0.7,
              }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {daysInfo.map((dayInfo, index) => {
          const dateIso = dayInfo.date.toISOString();
          const dateKey = dateIso.split('T')[0];
          const isDisabled = disablePastDates && dayInfo.date < today;

          return (
            <div
              key={dateKey}
              className="animate-float-in"
              style={{
                animationDelay: `${Math.min(index * 15, 400)}ms`,
                animationFillMode: 'both',
              }}
            >
              <DayCell
                dayInfo={dayInfo}
                hasNotes={monthNotes.some(n => n.date === dateKey)}
                dayNotes={monthNotes.filter(n => n.date === dateKey)}
                rangeNote={rangeNote}
                reminder={reminders[dateIso] || null}
                isFavourite={favorites.includes(dateIso)}
                onClick={() => !isDisabled && onDateClick(dayInfo.date)}
                onToggleFavorite={onToggleFavorite}
                onSetReminder={onSetReminder}
                isDisabled={isDisabled}
                isDarkTheme={isDarkTheme}
                monthTheme={monthTheme}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

CalendarGrid.displayName = 'CalendarGrid';
