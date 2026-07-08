import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface ActivityEntry {
  id: string;
  action: string;
  details: string;
  date: string;
  icon?: string;
}

interface ActivityContextValue {
  activities: ActivityEntry[];
  addActivity: (action: string, details: string, icon?: string) => void;
  clear: () => void;
}

const ActivityContext = createContext<ActivityContextValue>({
  activities: [],
  addActivity: () => {},
  clear: () => {},
});

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntry[]>(() => {
    try {
      const stored = localStorage.getItem('edu_activity_log');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('edu_activity_log', JSON.stringify(activities.slice(0, 200)));
  }, [activities]);

  const addActivity = useCallback((action: string, details: string, icon?: string) => {
    const entry: ActivityEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      action,
      details,
      date: new Date().toISOString(),
      icon,
    };
    setActivities(prev => [entry, ...prev].slice(0, 200));
  }, []);

  const clear = () => setActivities([]);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clear }}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => useContext(ActivityContext);
