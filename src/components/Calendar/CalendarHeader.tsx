/**
 * CalendarHeader Component - Premium glassmorphic month navigation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getMonthTheme } from '@utils/imageUtils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onToday: () => void;
  isDarkTheme?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onNextMonth,
  onPreviousMonth,
  onToday,
  isDarkTheme = false,
}) => {
  const [animKey, setAnimKey] = useState(0);
  const monthTheme = getMonthTheme(currentMonth.getMonth());

  const monthName = format(currentMonth, 'MMMM');
  const year = format(currentMonth, 'yyyy');

  // Trigger animation on month change
  useEffect(() => {
    setAnimKey((prev) => prev + 1);
  }, [currentMonth]);

  const buttonClasses = `
    relative px-4 py-2.5 rounded-xl font-body text-sm font-medium
    transition-all duration-300 ease-out
    hover:scale-105 active:scale-95
    backdrop-blur-xl
  `;

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 glass-card mb-6 gap-4 sm:gap-2
        ${isDarkTheme ? 'glass-premium' : 'glass-light'}
      `}
      style={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: monthTheme.glassBorder,
      }}
    >
      {/* Month & Year Display - Top on mobile, Center on desktop */}
      <div className="order-1 sm:order-2 flex-1 text-center w-full sm:w-auto" key={animKey}>
        <h2 className="premium-heading text-2xl xs:text-3xl md:text-4xl font-bold tracking-wide animate-month-slide">
          <span
            style={{
              backgroundImage: isDarkTheme
                ? `linear-gradient(135deg, ${monthTheme.accentGradient[1]} 0%, #ffffff 50%, ${monthTheme.accentGradient[1]} 100%)`
                : `linear-gradient(135deg, ${monthTheme.accentGradient[0]} 0%, ${monthTheme.accentGradient[1]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {monthName}
          </span>
          <span
            className="ml-2 sm:ml-3 font-body text-base xs:text-lg sm:text-xl font-light tracking-[0.1em] sm:tracking-[0.15em] uppercase"
            style={{
              color: isDarkTheme ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
            }}
          >
            {year}
          </span>
        </h2>

        {/* Decorative flourish - hidden on very small screens for space */}
        <div className="hidden xs:flex items-center justify-center mt-1 sm:mt-2 gap-2">
          <div
            className="h-[1px] w-12 sm:w-16"
            style={{
              background: `linear-gradient(to right, transparent, ${monthTheme.accentGradient[1]}40)`,
            }}
          />
          <div
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
            style={{ backgroundColor: monthTheme.accentGradient[1], opacity: 0.5 }}
          />
          <div
            className="h-[1px] w-12 sm:w-16"
            style={{
              background: `linear-gradient(to left, transparent, ${monthTheme.accentGradient[1]}40)`,
            }}
          />
        </div>
      </div>

      {/* Navigation controls - Left on desktop, Left-side part on mobile */}
      <div className="order-2 sm:order-1 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
        {/* Previous Month */}
        <button
          onClick={onPreviousMonth}
          className={`${buttonClasses} flex-1 sm:flex-none`}
          style={{
            background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            color: isDarkTheme ? '#e2e8f0' : '#1e293b',
          }}
          aria-label="Previous month"
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="xs:inline">Prev</span>
          </span>
        </button>

        {/* Today Button - visible in between on mobile for symmetry */}
        <button
          onClick={onToday}
          className={`${buttonClasses} flex-1 sm:hidden`}
          style={{
            background: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}cc, ${monthTheme.accentGradient[1]}cc)`,
            border: `1px solid ${monthTheme.accentGradient[1]}40`,
            color: '#ffffff',
            boxShadow: `0 4px 15px ${monthTheme.accentGradient[0]}20`,
          }}
          aria-label="Go to today"
        >
          Today
        </button>
        
        {/* Today Button for desktop (right side) */}
        <button
          onClick={onToday}
          className={`${buttonClasses} hidden sm:block mx-1 order-3`}
          style={{
            background: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}cc, ${monthTheme.accentGradient[1]}cc)`,
            border: `1px solid ${monthTheme.accentGradient[1]}40`,
            color: '#ffffff',
            boxShadow: `0 4px 20px ${monthTheme.accentGradient[0]}30`,
          }}
          aria-label="Go to today"
        >
          Today
        </button>

        {/* Next Month */}
        <button
          onClick={onNextMonth}
          className={`${buttonClasses} flex-1 sm:flex-none sm:order-4`}
          style={{
            background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            color: isDarkTheme ? '#e2e8f0' : '#1e293b',
          }}
          aria-label="Next month"
        >
          <span className="flex items-center justify-center gap-1.5">
            <span className="xs:inline">Next</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

CalendarHeader.displayName = 'CalendarHeader';
