/**
 * Custom hooks for the calendar
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { DateRange, Note } from '@app-types/calendar';
import {
  saveDateRange,
  loadDateRange,
  saveCurrentMonth,
  loadCurrentMonth,
  saveNotes,
  loadNotes,
  saveTheme,
  loadTheme,
  saveFavorites,
  loadFavorites,
  saveReminders,
  loadReminders,
} from '@utils/storageUtils';

/**
 * Hook for managing date range selection
 */
export function useDateRangeSelection(initialRange?: DateRange) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || { start: null, end: null }
  );
  const [tempStart, setTempStart] = useState<Date | null>(null);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedRange((prev) => {
      // First click - set start
      if (!prev.start) {
        setTempStart(date);
        return { ...prev, start: date };
      }

      // Second click - set end
      if (!prev.end) {
        const start = prev.start;
        const end = date;

        // Ensure start is before end
        if (start.getTime() > end.getTime()) {
          return { start: end, end: start };
        }
        return { ...prev, end };
      }

      // Third click - reset
      setTempStart(date);
      return { start: date, end: null };
    });
  }, []);

  const clearRange = useCallback(() => {
    setSelectedRange({ start: null, end: null });
    setTempStart(null);
  }, []);

  const setRange = useCallback((start: Date | null, end: Date | null) => {
    setSelectedRange({ start, end });
  }, []);

  return { selectedRange, handleDateClick, clearRange, setRange, tempStart };
}

/**
 * Hook for managing month navigation
 */
export function useMonthNavigation(initialDate?: Date) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialDate || new Date()
  );

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const previousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  return { currentMonth, nextMonth, previousMonth, goToToday, setCurrentMonth };
}

/**
 * Hook for managing notes with localStorage
 */
export function useNotes() {
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load all notes on mount
  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded || {});
    setIsLoaded(true);
  }, []);

  /**
   * Helper to determine which month bucket a date key belong to.
   * Day keys (YYYY-MM-DD) or Month keys (YYYY-MM) go into YYYY-MM.
   * Range keys (YYYY-MM-DD_YYYY-MM-DD) go into the month of the start date.
   */
  const getMonthBucket = (key: string): string => {
    // If it's YYYY-MM-DD or YYYY-MM-DD_YYYY-MM-DD, the first 7 chars are YYYY-MM
    return key.substring(0, 7);
  };

  /**
   * Atomic Add: Read freshest from disk -> Merge -> Save -> Update State
   */
  const addNote = useCallback((dateKey: string, note: Note) => {
    const bucket = getMonthBucket(dateKey);
    
    // 1. Read freshest data from disk
    const allNotes = loadNotes();
    
    // 2. Extract or create month bucket
    const monthBucket = allNotes[bucket] || [];
    
    // 3. Append new note (preventing duplicates just in case)
    if (monthBucket.some(n => n.id === note.id)) return;
    const updatedBucket = [...monthBucket, { ...note, date: dateKey }];
    
    // 4. Update the full collection
    const updatedAllNotes = { ...allNotes, [bucket]: updatedBucket };
    
    // 5. Save back to localStorage
    saveNotes(updatedAllNotes);
    
    // 6. Update local state
    setNotes(updatedAllNotes);
  }, []);

  /**
   * Atomic Update
   */
  const updateNote = useCallback((dateKey: string, noteId: string, content: string) => {
    const bucket = getMonthBucket(dateKey);
    const allNotes = loadNotes();
    const monthBucket = allNotes[bucket] || [];
    
    const updatedBucket = monthBucket.map((note) =>
      note.id === noteId
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    );
    
    const updatedAllNotes = { ...allNotes, [bucket]: updatedBucket };
    saveNotes(updatedAllNotes);
    setNotes(updatedAllNotes);
  }, []);

  /**
   * Atomic Delete
   */
  const deleteNote = useCallback((dateKey: string, noteId: string) => {
    const bucket = getMonthBucket(dateKey);
    const allNotes = loadNotes();
    const monthBucket = allNotes[bucket] || [];
    
    const updatedBucket = monthBucket.filter((note) => note.id !== noteId);
    
    const updatedAllNotes = { ...allNotes };
    if (updatedBucket.length === 0) {
      delete updatedAllNotes[bucket];
    } else {
      updatedAllNotes[bucket] = updatedBucket;
    }
    
    saveNotes(updatedAllNotes);
    setNotes(updatedAllNotes);
  }, []);

  /**
   * Helper to get notes for a specific month YYYY-MM
   */
  const getNotesForMonth = useCallback((monthKey: string): Note[] => {
    return notes[monthKey] || [];
  }, [notes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForMonth,
    isLoaded,
  };
}

/**
 * Hook for managing reminders
 */
export function useReminders() {
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadReminders();
    setReminders(loaded || {});
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveReminders(reminders);
    }
  }, [reminders, isHydrated]);

  const setReminder = useCallback((dateIso: string, text: string) => {
    setReminders((prev) => {
      const updated = { ...prev };
      if (!text.trim()) {
        delete updated[dateIso];
      } else {
        updated[dateIso] = text.trim();
      }
      return updated;
    });
  }, []);

  const getReminder = useCallback(
    (dateIso: string) => reminders[dateIso] || null,
    [reminders]
  );

  const hasReminder = useCallback(
    (dateIso: string) => !!reminders[dateIso],
    [reminders]
  );

  return { reminders, setReminder, getReminder, hasReminder, isLoaded: isHydrated };
}

/**
 * Hook for managing theme preference
 */
export function useTheme(initialTheme?: 'light' | 'dark') {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    initialTheme || 'light'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadTheme();
    setTheme(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTheme(theme);
      
      // Update HTML class
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    }
  }, [theme, isLoaded]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme, isLoaded };
}

/**
 * Hook for managing favorite dates
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadFavorites();
    setFavorites(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveFavorites(favorites);
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((dateIso: string) => {
    setFavorites((prev) => {
      if (prev.includes(dateIso)) {
        return prev.filter((d) => d !== dateIso);
      }
      return [...prev, dateIso];
    });
  }, []);

  const isFavorite = useCallback(
    (dateIso: string) => favorites.includes(dateIso),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}

/**
 * Hook for persisting calendar state
 */
export function useCalendarPersistence() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const saveState = useCallback(
    (range: DateRange, month: Date) => {
      if (isLoaded) {
        saveDateRange(range);
        saveCurrentMonth(month);
      }
    },
    [isLoaded]
  );

  const loadState = useCallback(() => {
    const range = loadDateRange();
    const month = loadCurrentMonth();
    return { range, month };
  }, []);

  return { saveState, loadState, isLoaded };
}
