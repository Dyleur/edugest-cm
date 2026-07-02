import { useState, useEffect } from 'react';
import { JournalEntry } from '../types/journal';

const STORAGE_KEY = 'photo-journal-entries';

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entries:', error);
    }
  }, [entries]);

  const addEntry = (entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}
