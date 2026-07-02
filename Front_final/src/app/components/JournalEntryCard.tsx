import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { JournalEntry, MOODS } from '../types/journal';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

export function JournalEntryCard({ entry, onDelete }: JournalEntryCardProps) {
  const moodData = MOODS.find((m) => m.value === entry.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-64">
          <img
            src={entry.photo}
            alt="Journal entry"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <span className="text-xl">{moodData?.emoji}</span>
            <span className="text-sm font-medium">{moodData?.label}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4" />
            <time dateTime={new Date(entry.date).toISOString()}>
              {format(entry.date, 'EEEE d MMMM yyyy', { locale: fr })}
            </time>
            <span className="text-gray-300">•</span>
            <span>{format(entry.date, 'HH:mm', { locale: fr })}</span>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{entry.note}</p>

          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
