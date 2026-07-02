import { Camera, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export function EmptyState({ onCreateFirst }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <Camera className="w-12 h-12 text-blue-500" />
        </div>
        <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Bienvenue dans votre journal photo
      </h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Capturez vos moments quotidiens avec des photos et des notes.
        Suivez vos humeurs au fil du temps.
      </p>
      
      <Button onClick={onCreateFirst} size="lg" className="gap-2">
        <Camera className="w-5 h-5" />
        Créer ma première entrée
      </Button>
    </div>
  );
}
