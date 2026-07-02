import { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { JournalEntry, Mood, MOODS } from '../types/journal';

interface JournalEntryFormProps {
  onSubmit: (entry: JournalEntry) => void;
  onCancel: () => void;
}

export function JournalEntryForm({ onSubmit, onCancel }: JournalEntryFormProps) {
  const [photo, setPhoto] = useState<string>('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !note.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: Date.now(),
      photo,
      note: note.trim(),
      mood,
    };

    onSubmit(entry);
    setPhoto('');
    setNote('');
    setMood('neutral');
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          {photo ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <img
                src={photo}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhoto('')}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Cliquez pour ajouter une photo</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Comment vous sentez-vous ?</label>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  mood === m.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Note</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Écrivez vos pensées du jour..."
            className="min-h-[120px]"
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!photo || !note.trim()}
            className="flex-1"
          >
            Enregistrer
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}
