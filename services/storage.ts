
import { AppState } from '../types';

const STORAGE_KEY = 'achievers_data_v2';

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return { history: {}, startedDays: [] };
    }
    const parsed = JSON.parse(serialized);
    return {
      history: parsed.history || {},
      startedDays: parsed.startedDays || []
    };
  } catch (err) {
    console.error("Could not load state", err);
    return { history: {}, startedDays: [] };
  }
};

export const saveState = (state: AppState) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Could not save state", err);
  }
};
