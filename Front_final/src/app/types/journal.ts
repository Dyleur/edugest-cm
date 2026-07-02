export type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm';

export interface JournalEntry {
  id: string;
  date: number;
  photo: string;
  note: string;
  mood: Mood;
}

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'happy', label: 'Heureux', emoji: '😊' },
  { value: 'sad', label: 'Triste', emoji: '😢' },
  { value: 'neutral', label: 'Neutre', emoji: '😐' },
  { value: 'excited', label: 'Excité', emoji: '🤩' },
  { value: 'anxious', label: 'Anxieux', emoji: '😰' },
  { value: 'calm', label: 'Calme', emoji: '😌' },
];
