import { format, isSameDay, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { JournalEntry, MOODS } from '../types/journal';
import { Card } from './ui/card';

interface TimelineViewProps {
  entries: JournalEntry[];
  onEntryClick?: (entry: JournalEntry) => void;
}

export function TimelineView({ entries, onEntryClick }: TimelineViewProps) {
  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateKey = format(startOfDay(entry.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Aucune entrée pour le moment.</p>
        <p className="text-sm mt-2">Commencez par créer votre première entrée !</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((dateKey) => {
        const dayEntries = groupedEntries[dateKey];
        const date = new Date(dateKey);

        return (
          <div key={dateKey} className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-200" />

            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
            </div>

            {/* Entries for this day */}
            <div className="ml-12 space-y-4">
              {dayEntries.map((entry) => {
                const moodData = MOODS.find((m) => m.value === entry.mood);
                return (
                  <Card
                    key={entry.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onEntryClick?.(entry)}
                  >
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={entry.photo}
                          alt="Journal entry"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{moodData?.emoji}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {moodData?.label}
                          </span>
                          <span className="text-sm text-gray-400">
                            {format(entry.date, 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{entry.note}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
