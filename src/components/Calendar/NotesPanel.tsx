/**
 * NotesPanel Component - Month-based notes management.
 * Each month has its own independent set of notes.
 * Notes persist across date selections and month navigation.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Note } from '@app-types/calendar';
import { getMonthTheme } from '@utils/imageUtils';

interface NotesPanelProps {
  currentMonth: Date;
  monthKey: string;          // "YYYY-MM" format
  activeNotes: Note[];       // Notes for the current context (range or month)
  monthNotes: Note[];        // Always the monthly notes
  onAddNote: (monthKey: string, note: Note) => void;
  onUpdateNote: (monthKey: string, noteId: string, content: string) => void;
  onDeleteNote: (monthKey: string, noteId: string) => void;
  selectedRange?: { start: Date | null; end: Date | null };
  isDarkTheme?: boolean;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  currentMonth,
  monthKey,
  activeNotes,
  monthNotes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  selectedRange,
  isDarkTheme = false,
}) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const monthTheme = getMonthTheme(currentMonth.getMonth());
  
  const isRangeSelected = !!(selectedRange?.start && selectedRange?.end);
  const rangeKey = isRangeSelected 
    ? `${selectedRange!.start!.toISOString().split('T')[0]}_${selectedRange!.end!.toISOString().split('T')[0]}`
    : null;
  
  const activeKey = rangeKey || monthKey;
  const monthLabel = isRangeSelected
    ? `${format(selectedRange!.start!, 'MMM d')} - ${format(selectedRange!.end!, 'MMM d, yyyy')}`
    : format(currentMonth, 'MMMM yyyy');

  const handleAddNote = useCallback(() => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      date: activeKey,
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddNote(activeKey, newNote);
    setNewNoteContent('');
  }, [newNoteContent, activeKey, onAddNote]);

  const handleUpdateNote = useCallback(
    (noteId: string, content: string) => {
      onUpdateNote(activeKey, noteId, content);
      setEditingNoteId(null);
      setEditingContent('');
    },
    [activeKey, onUpdateNote]
  );

  const handleDeleteNote = useCallback(
    (noteId: string) => {
      onDeleteNote(activeKey, noteId);
    },
    [activeKey, onDeleteNote]
  );

  const handleStartEdit = useCallback((note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  }, []);

  return (
    <div
      className={`h-full flex flex-col glass-card overflow-hidden ${
        isDarkTheme ? 'glass-premium' : 'glass-light'
      }`}
    >
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{
          borderColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}
      >
        <h3
          className="premium-heading text-lg font-bold mb-1"
          style={{
            backgroundImage: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}, ${monthTheme.accentGradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {isRangeSelected ? '🔗 Selection Notes' : '✦ Notes'}
        </h3>
        <p
          className="text-sm font-body"
          style={{ color: isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
        >
          {monthLabel}
        </p>
      </div>

      {/* Notes content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Context Notes (Range or Month) */}
        <div>
          {isRangeSelected && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Selection Notes</p>
            </div>
          )}
          
          {activeNotes.length === 0 ? (
            <div
              className={`text-center py-6 rounded-xl border-2 border-dashed ${
                isDarkTheme ? 'border-white/5' : 'border-black/5'
              }`}
            >
              <div className="text-2xl mb-2 opacity-50">{isRangeSelected ? '🔗' : '📝'}</div>
              <p className="text-xs font-body opacity-50">No {isRangeSelected ? 'notes for this range' : `notes for ${format(currentMonth, 'MMMM')}`}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="rounded-xl p-3 transition-all duration-300 animate-note-reveal"
                  style={{
                    animationDelay: `${index * 80}ms`,
                    background: isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-2.5 rounded-lg border resize-none focus:outline-none font-body text-sm"
                        style={{
                          background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
                          borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                        }}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateNote(note.id, editingContent)}
                          className="flex-1 px-3 py-1.5 rounded-lg text-white text-xs font-body font-medium transition-all duration-200"
                          style={{
                            background: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}, ${monthTheme.accentGradient[1]})`,
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-200"
                          style={{
                            background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.05)',
                            color: isDarkTheme ? '#e2e8f0' : '#64748b',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p
                        className="text-sm font-body leading-relaxed"
                        style={{ color: isDarkTheme ? '#e2e8f0' : '#1e293b' }}
                      >
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <p
                          className="text-[10px] font-body"
                          style={{ color: isDarkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
                        >
                          {format(new Date(note.updatedAt), 'MMM d, HH:mm')}
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleStartEdit(note)}
                            className="text-[10px] px-2 py-1 rounded-md font-body font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              background: `${monthTheme.accentGradient[1]}20`,
                              color: monthTheme.accentGradient[1],
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-[10px] px-2 py-1 rounded-md font-body font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Notes Section (Always show if range is selected) */}
        {isRangeSelected && monthNotes.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Monthly Notes ({format(currentMonth, 'MMMM')})</p>
            </div>
            <div className="space-y-2 opacity-50">
              {monthNotes.map((note) => (
                <div
                  key={`month-${note.id}`}
                  className="rounded-lg p-2 text-xs font-body"
                  style={{
                    background: isDarkTheme ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  {note.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add note section - always visible, no date selection required */}
      <div
        className="p-4 border-t"
        style={{
          borderColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        }}
      >
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleAddNote();
            }
          }}
          placeholder={isRangeSelected 
            ? "Add a note for this range... (Ctrl+Enter)" 
            : `Add a note for ${format(currentMonth, 'MMMM')}... (Ctrl+Enter)`}
          className="w-full p-3 rounded-xl border focus:outline-none resize-none font-body text-sm"
          style={{
            background: isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            borderColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            color: isDarkTheme ? '#e2e8f0' : '#1e293b',
          }}
          rows={3}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNoteContent.trim()}
          className="w-full mt-2 px-4 py-2.5 rounded-xl text-white font-body text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          style={{
            background: `linear-gradient(135deg, ${monthTheme.accentGradient[0]}, ${monthTheme.accentGradient[1]})`,
            boxShadow: `0 4px 15px ${monthTheme.glowColor}`,
          }}
        >
          Add Note ✦
        </button>
      </div>
    </div>
  );
};

NotesPanel.displayName = 'NotesPanel';
