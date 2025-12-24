
export interface Habit {
  id: string;
  name: string;
  description?: string;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  completedHabits: string[]; // Array of Habit IDs
}

export interface AppState {
  history: Record<string, string[]>; // date string -> habit ids
  startedDays: string[]; // Array of YYYY-MM-DD strings
}

export type ViewType = 'daily' | 'weekly' | 'monthly' | 'yearly';
