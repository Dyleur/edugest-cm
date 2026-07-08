import { useLanguage, LANGUAGE_NAMES } from '../../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Globe } from 'lucide-react';

interface Props {
  variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ variant = 'default' }: Props) {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
      <SelectTrigger className={variant === 'compact' ? 'w-9 h-9 p-0 justify-center' : 'w-[140px] h-9 text-sm gap-1.5'}>
        {variant === 'compact' ? (
          <Globe className="w-4 h-4" />
        ) : (
          <>
            <Globe className="w-3.5 h-3.5" />
            <span>{LANGUAGE_NAMES[language]}</span>
          </>
        )}
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang} value={lang}>
            {LANGUAGE_NAMES[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
