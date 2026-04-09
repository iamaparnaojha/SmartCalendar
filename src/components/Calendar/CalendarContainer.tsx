/**
 * CalendarContainer Component - Main calendar with full-bleed background,
 * glassmorphic shell, page-flip transition, and month-based notes.
 */

'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { HeroImage } from './HeroImage';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { CelebrationOverlay, CelebrationType } from './CelebrationOverlay';
import {
  useDateRangeSelection,
  useMonthNavigation,
  useNotes,
  useTheme,
  useCalendarPersistence,
  useFavorites,
  useReminders,
} from '@hooks/useCalendar';
import { getDateKey } from '@utils/calendarUtils';
import { getImageForMonth, getMonthTheme } from '@utils/imageUtils';
import { Note } from '@app-types/calendar';

interface CalendarContainerProps {
  disablePastDates?: boolean;
  showThemeToggle?: boolean;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  disablePastDates = false,
  showThemeToggle = true,
}) => {
  const { theme, toggleTheme, isLoaded: themeLoaded } = useTheme();
  const { currentMonth, nextMonth, previousMonth, goToToday, setCurrentMonth } =
    useMonthNavigation();
  const { selectedRange, handleDateClick, clearRange, setRange } =
    useDateRangeSelection();
  const { notes, addNote, updateNote, deleteNote, getNotesForMonth, isLoaded: notesLoaded } =
    useNotes();
  const { favorites, toggleFavorite, isFavorite, isLoaded: favsLoaded } = useFavorites();
  const { reminders, setReminder, hasReminder, isLoaded: remindersLoaded } = useReminders();
  const { saveState, loadState } = useCalendarPersistence();

  const [celebration, setCelebration] = useState<{ isVisible: boolean; type: CelebrationType }>({
    isVisible: false,
    type: 'success'
  });

  const [prevBgUrl, setPrevBgUrl] = useState<string>('');
  const [bgKey, setBgKey] = useState(0);

  // Page flip state
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === 'dark';

  // Month key for notes: "YYYY-MM"
  const monthKey = useMemo(() => format(displayMonth, 'yyyy-MM'), [displayMonth]);

  // Current range key and shared note
  const rangeKey = useMemo(() => {
    if (selectedRange.start && selectedRange.end) {
      return `${selectedRange.start.toISOString().split('T')[0]}_${selectedRange.end.toISOString().split('T')[0]}`;
    }
    return null;
  }, [selectedRange]);

  const rangeNote = useMemo(() => {
    if (!rangeKey) return null;
    const notesForRange = notes[rangeKey] || [];
    return notesForRange.length > 0 ? notesForRange[notesForRange.length - 1] : null;
  }, [notes, rangeKey]);

  // Active context notes
  const monthNotes = useMemo(() => {
    return getNotesForMonth(monthKey);
  }, [getNotesForMonth, monthKey]);

  const activeNotes = useMemo(() => {
    const contextKey = rangeKey || monthKey;
    if (rangeKey) {
      // Filter the month bucket for notes matching this range key
      return monthNotes.filter(n => n.date === rangeKey);
    }
    // If no range, active is just the month bucket
    return monthNotes;
  }, [monthNotes, rangeKey, monthKey]);

  // Load persisted state on mount
  useEffect(() => {
    if (themeLoaded && notesLoaded) {
      const { range, month } = loadState();
      setCurrentMonth(month);
      setDisplayMonth(month);
      setRange(range.start, range.end);
    }
  }, [themeLoaded, notesLoaded]);

  // Save state whenever it changes
  useEffect(() => {
    if (themeLoaded && notesLoaded) {
      saveState(selectedRange, currentMonth);
    }
  }, [selectedRange, currentMonth, themeLoaded, notesLoaded, saveState]);

  // Create a map of dates that have notes for efficient lookup on day cells
  const notesMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    // Extract everything from the current month bucket
    monthNotes.forEach((note) => {
      map[note.date] = true;
    });
    return map;
  }, [monthNotes]);

  // Get current month's image and theme
  const currentImage = useMemo(() => getImageForMonth(displayMonth.getMonth()), [displayMonth]);
  const monthTheme = useMemo(() => getMonthTheme(displayMonth.getMonth()), [displayMonth]);

  // Background crossfade tracking
  useEffect(() => {
    if (prevBgUrl !== currentImage.url) {
      setPrevBgUrl(currentImage.url);
      setBgKey((k) => k + 1);
    }
  }, [currentImage.url]);

  // Page flip handlers
  const handleNextMonth = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('forward');

    // After the "exit" animation, update the actual month
    flipTimeoutRef.current = setTimeout(() => {
      nextMonth();
      setDisplayMonth((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + 1);
        return next;
      });
      // After a brief delay, clear flip state so "enter" animation plays
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 400); // Wait for the enter animation to finish
    }, 400); // Synchronize with the 0.4s (400ms) exit animation
  }, [isFlipping, nextMonth]);

  const handlePreviousMonth = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('backward');

    flipTimeoutRef.current = setTimeout(() => {
      previousMonth();
      setDisplayMonth((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() - 1);
        return next;
      });
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 400);
    }, 400);
  }, [isFlipping, previousMonth]);

  const handleGoToToday = useCallback(() => {
    if (isFlipping) return;
    const today = new Date();
    const currentM = displayMonth.getMonth();
    const todayM = today.getMonth();
    const currentY = displayMonth.getFullYear();
    const todayY = today.getFullYear();

    if (currentM === todayM && currentY === todayY) return;

    const goingForward = todayY > currentY || (todayY === currentY && todayM > currentM);
    setIsFlipping(true);
    setFlipDirection(goingForward ? 'forward' : 'backward');

    flipTimeoutRef.current = setTimeout(() => {
      goToToday();
      setDisplayMonth(today);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 400);
    }, 400);
  }, [isFlipping, goToToday, displayMonth]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  // Note handlers for month-based system
  const handleAddNote = useCallback((monthKey: string, note: Note) => {
    addNote(monthKey, note);
  }, [addNote]);

  const handleUpdateNote = useCallback((monthKey: string, noteId: string, content: string) => {
    updateNote(monthKey, noteId, content);
  }, [updateNote]);

  const handleDeleteNote = useCallback((dateKey: string, noteId: string) => {
    deleteNote(dateKey, noteId);
  }, [deleteNote]);

  const handleToggleFavorite = useCallback((dateIso: string) => {
    const becomingFav = !isFavorite(dateIso);
    toggleFavorite(dateIso);
    if (becomingFav) {
      setCelebration({ isVisible: true, type: 'hearts' });
    }
  }, [isFavorite, toggleFavorite]);

  const handleSetReminder = useCallback((dateIso: string, text: string) => {
    const isNew = !hasReminder(dateIso) && text.trim() !== '';
    setReminder(dateIso, text);
    if (isNew) {
      setCelebration({ isVisible: true, type: 'reminder' });
    }
  }, [hasReminder, setReminder]);

  // Determine flip CSS class
  const flipClass = useMemo(() => {
    if (!flipDirection) return 'page-flip-enter'; // initial entry
    if (isFlipping) {
      return flipDirection === 'forward' ? 'page-flip-forward' : 'page-flip-backward';
    }
    return flipDirection === 'forward' ? 'page-flip-enter' : 'page-flip-enter-back';
  }, [flipDirection, isFlipping]);

  if (!themeLoaded || !notesLoaded || !favsLoaded || !remindersLoaded) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: '#050a18' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'rgba(255,255,255,0.1)',
              borderTopColor: monthTheme.accentGradient[1],
            }}
          />
          <p className="font-body text-sm text-white/30 tracking-wider uppercase">
            Loading Calendar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        '--color-primary': currentImage.colors.primary,
        '--color-secondary': currentImage.colors.secondary,
        '--color-accent': currentImage.colors.accent,
      } as React.CSSProperties}
    >
      {/* === Full-bleed background image === */}
      <div className="fixed inset-0 z-0">
        <div
          key={bgKey}
          className="absolute inset-0 animate-bg-crossfade"
          style={{
            backgroundImage: `url(${currentImage.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.35) saturate(1.4)',
            transform: 'scale(1.15)',
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'rgba(5, 10, 24, 0.75)'
              : 'rgba(240, 245, 255, 0.65)',
          }}
        />
        {/* Gradient mesh */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, ${currentImage.colors.primary}25 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, ${currentImage.colors.accent}20 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${currentImage.colors.secondary}15 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* === Header === */}
      <header
        className={`sticky top-0 z-50 ${isDark ? 'glass-dark' : 'glass-light'}`}
        style={{
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <span
              className="premium-heading text-xl sm:text-2xl font-bold tracking-wide"
              style={{
                backgroundImage: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}, ${monthTheme.accentGradient[1]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Smart Calendar
            </span>
          </h1>

          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
              aria-label="Toggle theme"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
            </button>
          )}
        </div>
      </header>

      {/* === Main content === */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Calendar Header with controls */}
        <CalendarHeader
          currentMonth={displayMonth}
          onNextMonth={handleNextMonth}
          onPreviousMonth={handlePreviousMonth}
          onToday={handleGoToToday}
          isDarkTheme={isDark}
        />

        {/* Celebration Animation (Hearts/Reminders/Success) */}
        <CelebrationOverlay 
          isVisible={celebration.isVisible} 
          type={celebration.type}
          onFinished={() => setCelebration(prev => ({ ...prev, isVisible: false }))} 
        />

        {/* Page flip container */}
        <div className="page-flip-container">
          <div
            key={`page-${format(displayMonth, 'yyyy-MM')}`}
            className={flipClass}
          >
            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:min-h-[580px]">
              {/* Left side - Hero Image */}
              <div className="lg:col-span-1 h-[280px] sm:h-[320px] lg:h-full">
                <HeroImage
                  currentMonth={displayMonth}
                  isDarkTheme={isDark}
                />
              </div>

              {/* Right side - Calendar Grid and Notes */}
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                  <div
                    className={`glass-card p-4 sm:p-5 ${isDark ? 'glass-premium' : 'glass-light'}`}
                  >
                    <CalendarGrid
                      currentMonth={displayMonth}
                      selectedRange={selectedRange}
                      monthNotes={monthNotes}
                      favorites={favorites}
                      reminders={reminders}
                      rangeNote={rangeNote}
                      onDateClick={handleDateClick}
                      onToggleFavorite={handleToggleFavorite}
                      onSetReminder={handleSetReminder}
                      isDarkTheme={isDark}
                      disablePastDates={disablePastDates}
                    />
                  </div>
                </div>

                {/* Notes Panel — month-based */}
                <div className="lg:col-span-1">
                  <NotesPanel
                    currentMonth={displayMonth}
                    monthKey={monthKey}
                    activeNotes={activeNotes}
                    monthNotes={monthNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    selectedRange={selectedRange}
                    isDarkTheme={isDark}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected range info */}
        {(selectedRange.start || selectedRange.end) && (
          <div
            className={`glass-card mt-6 p-4 ${isDark ? 'glass-premium' : 'glass-light'}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p
                  className="text-xs font-body font-medium uppercase tracking-wider"
                  style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                >
                  Selected Period
                </p>
                <p
                  className="text-base sm:text-lg font-heading font-bold mt-0.5"
                  style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                >
                  {selectedRange.start && selectedRange.end
                    ? `${new Date(selectedRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(selectedRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : selectedRange.start
                    ? new Date(selectedRange.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Click to select'}
                </p>
              </div>
              <button
                onClick={clearRange}
                className="px-4 py-2 rounded-xl font-body text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

CalendarContainer.displayName = 'CalendarContainer';
