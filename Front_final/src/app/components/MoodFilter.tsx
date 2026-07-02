import { Mood, MOODS } from '../types/journal';

interface MoodFilterProps {
  selectedMood: Mood | 'all';
  onMoodChange: (mood: Mood | 'all') => void;
}

export function MoodFilter({ selectedMood, onMoodChange }: MoodFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onMoodChange('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedMood === 'all'
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tous
      </button>
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onMoodChange(mood.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            selectedMood === mood.value
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{mood.emoji}</span>
          <span>{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
