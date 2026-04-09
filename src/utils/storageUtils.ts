/**
 * LocalStorage utilities for persisting calendar data
 */

import { Note, DateRange } from '@app-types/calendar';

const STORAGE_KEYS = {
  NOTES: 'calendar_notes',
  SELECTED_RANGE: 'calendar_selected_range',
  CURRENT_MONTH: 'calendar_current_month',
  THEME: 'calendar_theme',
  FAVORITES: 'calendar_favorites',
  REMINDERS: 'calendar_reminders',
};

/**
 * Save notes to localStorage
 */
export function saveNotes(notes: Record<string, Note[]>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEYS.NOTES, serialized);
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
}

/**
 * Load notes from localStorage
 */
export function loadNotes(): Record<string, Note[]> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!stored) return {};
    return JSON.parse(stored) as Record<string, Note[]>;
  } catch (error) {
    console.error('Failed to load notes:', error);
    return {};
  }
}

/**
 * Save selected date range
 */
export function saveDateRange(range: DateRange): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = JSON.stringify({
      start: range.start?.toISOString() || null,
      end: range.end?.toISOString() || null,
    });
    localStorage.setItem(STORAGE_KEYS.SELECTED_RANGE, serialized);
  } catch (error) {
    console.error('Failed to save date range:', error);
  }
}

/**
 * Load selected date range
 */
export function loadDateRange(): DateRange {
  if (typeof window === 'undefined') {
    return { start: null, end: null };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_RANGE);
    if (!stored) return { start: null, end: null };
    
    const data = JSON.parse(stored) as {
      start: string | null;
      end: string | null;
    };
    
    return {
      start: data.start ? new Date(data.start) : null,
      end: data.end ? new Date(data.end) : null,
    };
  } catch (error) {
    console.error('Failed to load date range:', error);
    return { start: null, end: null };
  }
}

/**
 * Save current month
 */
export function saveCurrentMonth(date: Date): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, date.toISOString());
  } catch (error) {
    console.error('Failed to save current month:', error);
  }
}

/**
 * Load current month
 */
export function loadCurrentMonth(): Date {
  if (typeof window === 'undefined') {
    return new Date();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_MONTH);
    if (!stored) return new Date();
    return new Date(stored);
  } catch (error) {
    console.error('Failed to load current month:', error);
    return new Date();
  }
}

/**
 * Save theme preference
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

/**
 * Load theme preference
 */
export function loadTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch (error) {
    console.error('Failed to load theme:', error);
    return 'light';
  }
}

/**
 * Save favorites to localStorage
 */
export function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
}

/**
 * Load favorites from localStorage
 */
export function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
}

/**
 * Save reminders to localStorage
 */
export function saveReminders(reminders: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Failed to save reminders:', error);
  }
}

/**
 * Load reminders from localStorage
 */
export function loadReminders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!stored) return {};
    return JSON.parse(stored) as Record<string, string>;
  } catch (error) {
    console.error('Failed to load reminders:', error);
    return {};
  }
}

/**
 * Clear all calendar data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
