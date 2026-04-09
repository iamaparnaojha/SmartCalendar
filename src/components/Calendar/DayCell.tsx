/**
 * DayCell Component - Premium glassmorphic day cell with:
 * - 3D flip animation on click
 * - Smart hover tooltip showing note previews & holiday info
 * - Premium holiday celebration effects (glow, confetti, special gradient)
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { DayInfo } from '@app-types/calendar';
import { Note } from '@app-types/calendar';
import { getHolidayInfo } from '@utils/calendarUtils';
import { MonthTheme } from '@utils/imageUtils';
import { SmartTooltip } from './SmartTooltip';

interface DayCellProps {
  dayInfo: DayInfo;
  hasNotes: boolean;
  dayNotes: Note[];
  rangeNote?: Note | null; // Shared note for a range
  reminder?: string | null;
  onClick: () => void;
  onToggleFavorite?: (dateIso: string) => void;
  onSetReminder?: (dateIso: string, text: string) => void;
  isFavourite?: boolean;
  isDisabled?: boolean;
  isDarkTheme?: boolean;
  monthTheme: MonthTheme;
}

export const DayCell: React.FC<DayCellProps> = ({
  dayInfo,
  hasNotes,
  dayNotes,
  rangeNote,
  reminder,
  onClick,
  onToggleFavorite,
  onSetReminder,
  isFavourite = false,
  isDisabled = false,
  isDarkTheme = false,
  monthTheme,
}) => {
  const holiday = useMemo(() => getHolidayInfo(dayInfo.date), [dayInfo.date]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 600);
      onClick();
    }
  }, [isDisabled, onClick]);

  const handleSetReminder = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    
    const existing = reminder || '';
    const text = window.prompt('Set a reminder for this date:', existing);
    
    if (text !== null) {
      onSetReminder?.(dayInfo.date.toISOString(), text);
    }
  }, [dayInfo.date, isDisabled, onSetReminder, reminder]);

  // Build tooltip lines
  const tooltipLines = useMemo(() => {
    const lines: { label?: string; text: string; emoji?: string }[] = [];

    if (holiday && dayInfo.isCurrentMonth) {
      lines.push({
        label: 'Holiday',
        text: holiday.name,
        emoji: holiday.emoji,
      });
    }

    if (reminder && dayInfo.isCurrentMonth) {
      lines.push({
        label: 'Reminder',
        text: reminder,
        emoji: '🔔',
      });
    }

    if (hasNotes && dayNotes.length > 0 && dayInfo.isCurrentMonth) {
      const latestNote = dayNotes[dayNotes.length - 1];
      const preview = latestNote.content.length > 50
        ? latestNote.content.slice(0, 50) + '…'
        : latestNote.content;
      lines.push({
        label: `Note${dayNotes.length > 1 ? ` (${dayNotes.length})` : ''}`,
        text: preview,
        emoji: '📝',
      });
    }

    if (rangeNote && dayInfo.isInRange && dayInfo.isCurrentMonth) {
      const preview = rangeNote.content.length > 50
        ? rangeNote.content.slice(0, 50) + '…'
        : rangeNote.content;
      lines.push({
        label: 'Shared Note',
        text: preview,
        emoji: '🔗',
      });
    }

    if (dayInfo.isToday && dayInfo.isCurrentMonth) {
      lines.push({ text: 'Today', emoji: '📍' });
    }

    return lines;
  }, [holiday, hasNotes, dayNotes, rangeNote, dayInfo]);

  // Cell background styles
  const cellStyle = useMemo((): React.CSSProperties => {
    if (!dayInfo.isCurrentMonth) {
      return { opacity: 0.2 };
    }

    if (dayInfo.isRangeStart || dayInfo.isRangeEnd) {
      return {
        background: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}, ${monthTheme.accentGradient[1]})`,
        boxShadow: `0 4px 20px ${monthTheme.glowColor}`,
        color: '#ffffff',
      };
    }

    if (dayInfo.isInRange) {
      return {
        background: isDarkTheme
          ? `${monthTheme.glassOverlay}`
          : `rgba(${parseInt(monthTheme.accentGradient[1].slice(1, 3), 16)}, ${parseInt(monthTheme.accentGradient[1].slice(3, 5), 16)}, ${parseInt(monthTheme.accentGradient[1].slice(5, 7), 16)}, 0.15)`,
        borderColor: `${monthTheme.glassBorder}`,
      };
    }

    if (dayInfo.isToday) {
      return {
        border: `2px solid ${monthTheme.accentGradient[1]}`,
        boxShadow: `0 0 15px ${monthTheme.glowColor}, inset 0 0 8px ${monthTheme.glowColor}`,
      };
    }

    if (holiday) {
      return {
        ['--holiday-color' as string]: holiday.color,
        background: isDarkTheme
          ? `linear-gradient(135deg, ${holiday.gradient[0]}15, ${holiday.gradient[1]}10)`
          : `linear-gradient(135deg, ${holiday.gradient[0]}12, ${holiday.gradient[1]}08)`,
      };
    }

    if (reminder) {
      return {
        background: isDarkTheme ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.08)',
        borderColor: '#fbbf24',
        boxShadow: `inset 0 0 10px rgba(251, 191, 36, 0.1), 0 0 10px rgba(251, 191, 36, 0.1)`,
      };
    }

    return {};
  }, [dayInfo, isDarkTheme, monthTheme, holiday, reminder]);

  // Text color
  const textColor = useMemo(() => {
    if (!dayInfo.isCurrentMonth) return isDarkTheme ? '#4a5568' : '#cbd5e1';
    if (isDisabled) return isDarkTheme ? '#4a5568' : '#94a3b8';
    if (dayInfo.isRangeStart || dayInfo.isRangeEnd) return '#ffffff';
    if (dayInfo.isWeekend) return isDarkTheme ? monthTheme.accentGradient[1] : monthTheme.accentGradient[0];
    return isDarkTheme ? '#e2e8f0' : '#1e293b';
  }, [dayInfo, isDisabled, isDarkTheme, monthTheme]);

  return (
    <div
      className="relative w-full aspect-square group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          absolute inset-0 w-full h-full rounded-xl
          flex flex-col items-center justify-center
          font-body font-semibold select-none overflow-hidden
          transition-all duration-300 ease-out
          ${!isDisabled && dayInfo.isCurrentMonth ? 'hover:scale-[1.08] hover:shadow-lg cursor-pointer' : ''}
          ${isFlipped ? 'animate-flip-card' : ''}
          ${holiday && dayInfo.isCurrentMonth ? 'animate-holiday-glow' : ''}
          ${reminder && dayInfo.isCurrentMonth && !isFlipped ? 'animate-reminder-bounce' : ''}
        `}
        style={{
          ...cellStyle,
          color: textColor,
          backdropFilter: dayInfo.isCurrentMonth ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: dayInfo.isCurrentMonth ? 'blur(8px)' : undefined,
          background: cellStyle.background || (dayInfo.isCurrentMonth
            ? (isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
            : 'transparent'),
          borderWidth: cellStyle.border ? undefined : (dayInfo.isCurrentMonth ? '1px' : '0px'),
          borderStyle: cellStyle.border ? undefined : (dayInfo.isCurrentMonth ? 'solid' : 'none'),
          borderColor: cellStyle.borderColor || (isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
          transformStyle: 'preserve-3d',
        }}
        title={
          holiday
            ? `${format(dayInfo.date, 'd')} - ${holiday.name}`
            : format(dayInfo.date, 'EEEE, MMMM d, yyyy')
        }
        aria-label={`${format(dayInfo.date, 'EEEE, MMMM d, yyyy')}${hasNotes ? ', has notes' : ''}${holiday ? `, ${holiday.name}` : ''}`}
      >
        {/* Day number */}
        <span className="text-sm z-10 relative">
          {format(dayInfo.date, 'd')}
        </span>

        {/* Holiday emoji */}
        {holiday && dayInfo.isCurrentMonth && (
          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 text-[10px]">
            {holiday.emoji}
          </div>
        )}

        {/* Notes indicator dot */}
        {hasNotes && dayInfo.isCurrentMonth && (
          <div
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-gentle-pulse"
            style={{
              backgroundColor: dayInfo.isRangeStart || dayInfo.isRangeEnd
                ? '#ffffff'
                : monthTheme.accentGradient[1],
              boxShadow: `0 0 4px ${monthTheme.accentGradient[1]}`,
            }}
          />
        )}

        {/* Holiday sparkle particles */}
        {holiday && dayInfo.isCurrentMonth && isHovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  backgroundColor: holiday.color,
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animation: `sparkle 1.2s ease-in-out ${i * 0.3}s infinite`,
                  opacity: 0.8,
                }}
              />
            ))}
          </>
        )}

        {/* Reminder indicator Bell */}
        {reminder && dayInfo.isCurrentMonth && (
          <div
            className="absolute bottom-1 right-1 text-[10px] animate-pulse"
          >
            🔔
          </div>
        )}

        {/* Favorite Heart Toggle */}
        {!isDisabled && dayInfo.isCurrentMonth && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(dayInfo.date.toISOString());
            }}
            className={`
              absolute top-1 left-1.5 z-20 transition-all duration-300
              ${isFavourite ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:scale-125'}
            `}
            style={{
              color: isFavourite ? '#ff4d6d' : 'inherit',
              filter: isFavourite ? 'drop-shadow(0 0 5px rgba(255, 77, 109, 0.4))' : 'none',
            }}
          >
            {isFavourite ? '❤️' : '🤍'}
          </button>
        )}

        {/* Reminder Toggle */}
        {!isDisabled && dayInfo.isCurrentMonth && (
          <button
            onClick={handleSetReminder}
            className={`
              absolute top-1 right-1.5 z-20 transition-all duration-300
              ${reminder ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:scale-125'}
            `}
            style={{
              color: reminder ? '#fbbf24' : 'inherit',
              filter: reminder ? 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.4))' : 'none',
              // Offset slightly from the notes dot if both exist
              transform: hasNotes ? 'translateY(12px)' : 'none',
            }}
          >
            {reminder ? '🔔' : '🔔'}
          </button>
        )}
      </button>

      <style jsx>{`
        @keyframes reminderBounce {
          0%, 100% { transform: translateY(0) scale(1.01); }
          50% { transform: translateY(-2px) scale(1.02); }
        }
        .animate-reminder-bounce {
          animation: reminderBounce 2s ease-in-out infinite;
        }
      `}</style>

      {/* Smart tooltip on hover */}
      {dayInfo.isCurrentMonth && tooltipLines.length > 0 && (
        <SmartTooltip
          lines={tooltipLines}
          visible={isHovered}
          accentColor={holiday?.color || monthTheme.accentGradient[1]}
        />
      )}
    </div>
  );
};

DayCell.displayName = 'DayCell';
