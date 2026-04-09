/**
 * Example Usage of the Interactive Wall Calendar
 * 
 * This file demonstrates various ways to use and customize the calendar component.
 */

'use client';

import React, { useState } from 'react';
import { CalendarContainer } from '@components/Calendar';

/**
 * Example 1: Basic Calendar (Default Configuration)
 */
export function BasicCalendarExample() {
  return (
    <div>
      <h1>Basic Calendar</h1>
      <CalendarContainer />
    </div>
  );
}

/**
 * Example 2: No Past Dates Selection
 */
export function NoPastDatesExample() {
  return (
    <div>
      <h1>Calendar - No Past Dates</h1>
      <CalendarContainer 
        disablePastDates={true}
        showThemeToggle={true}
      />
    </div>
  );
}

/**
 * Example 3: Without Theme Toggle
 */
export function NoThemeToggleExample() {
  return (
    <div>
      <h1>Calendar - No Theme Toggle</h1>
      <CalendarContainer 
        disablePastDates={false}
        showThemeToggle={false}
      />
    </div>
  );
}

/**
 * Example 4: Multiple Calendars
 */
export function MultipleCalendarsExample() {
  return (
    <div>
      <h1>Multiple Calendars</h1>
      <div className="space-y-12">
        <div>
          <h2>First Calendar</h2>
          <CalendarContainer disablePastDates={false} />
        </div>
        <hr />
        <div>
          <h2>Second Calendar</h2>
          <CalendarContainer disablePastDates={false} />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Custom Wrapper with Additional Features
 */
export function CustomCalendarWrapper() {
  const [exportData, setExportData] = useState<boolean>(false);

  const handleExport = () => {
    const notes = localStorage.getItem('calendar_notes');
    const range = localStorage.getItem('calendar_selected_range');
    
    const data = {
      notes: notes ? JSON.parse(notes) : {},
      selectedRange: range ? JSON.parse(range) : null,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          📥 Export Calendar Data
        </button>
        <button
          onClick={() => {
            if (confirm('Clear all calendar data?')) {
              localStorage.removeItem('calendar_notes');
              localStorage.removeItem('calendar_selected_range');
              localStorage.removeItem('calendar_current_month');
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          🗑️ Clear All Data
        </button>
      </div>
      <CalendarContainer />
    </div>
  );
}

/**
 * Example 6: Calendar with Custom Styling
 */
export function StyledCalendarExample() {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✨ Beautiful Event Calendar ✨
          </h1>
          <p className="text-gray-600">
            Plan your events with a beautiful, interactive calendar
          </p>
        </header>
        <CalendarContainer />
      </div>
    </div>
  );
}

/**
 * Example 7: Dashboard Integration
 */
export function DashboardExample() {
  const [stats, setStats] = React.useState<{
    totalNotes: number;
    datesWithNotes: number;
  }>({
    totalNotes: 0,
    datesWithNotes: 0,
  });

  React.useEffect(() => {
    // Update stats
    const notes = localStorage.getItem('calendar_notes');
    if (notes) {
      const parsed = JSON.parse(notes) as Record<string, any>;
      const totalNotes = Object.values(parsed).reduce<number>(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      );
      const datesWithNotes = Object.keys(parsed).length;
      setStats({ totalNotes, datesWithNotes });
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Stats Cards */}
      <div className="bg-blue-100 p-6 rounded-lg">
        <h3 className="text-gray-600 text-sm font-medium">Total Notes</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalNotes}</p>
      </div>
      <div className="bg-purple-100 p-6 rounded-lg">
        <h3 className="text-gray-600 text-sm font-medium">Dates with Notes</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.datesWithNotes}</p>
      </div>
      <div className="bg-green-100 p-6 rounded-lg">
        <h3 className="text-gray-600 text-sm font-medium">This Month</h3>
        <p className="text-3xl font-bold text-green-600">
          {new Date().toLocaleDateString('en-US', { month: 'short' })}
        </p>
      </div>
      <div className="bg-orange-100 p-6 rounded-lg">
        <h3 className="text-gray-600 text-sm font-medium">Days Used</h3>
        <p className="text-3xl font-bold text-orange-600">
          {new Date().getDate()}
        </p>
      </div>

      {/* Calendar */}
      <div className="lg:col-span-4">
        <CalendarContainer />
      </div>
    </div>
  );
}

/**
 * Example 8: Minimal version with Limited Features
 */
export function MinimalCalendarExample() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📅 Simple Calendar</h1>
        <CalendarContainer 
          disablePastDates={false}
          showThemeToggle={false}
        />
      </div>
    </div>
  );
}

/**
 * Example: Accessing Calendar State from Custom Component
 * 
 * This shows how to access and use the custom hooks
 */
export function AccessingCalendarStateExample() {
  const { useDateRangeSelection, useMonthNavigation, useNotes } = require('@hooks/useCalendar');
  
  // You can use the hooks in your own components
  // const { selectedRange, handleDateClick } = useDateRangeSelection();
  // const { currentMonth, nextMonth, previousMonth } = useMonthNavigation();
  // const { notes, addNote, deleteNote } = useNotes();

  return (
    <div>
      <p>
        You can import and use the calendar hooks in your own components.
        See the hooks file for detailed hook documentation.
      </p>
      <CalendarContainer />
    </div>
  );
}

export default BasicCalendarExample;
