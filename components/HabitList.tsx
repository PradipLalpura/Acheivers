
import React from 'react';
import { FIXED_HABITS } from '../constants';
import { AppState } from '../types';
import { Check, Lock, AlertTriangle, Play } from 'lucide-react';
import { isToday } from 'date-fns';

interface HabitListProps {
  selectedDate: string;
  isFutureDate: boolean;
  history: AppState['history'];
  startedDays: string[];
  onToggle: (habitId: string) => void;
  onStartDay: () => void;
}

const HabitList: React.FC<HabitListProps> = ({ selectedDate, isFutureDate, history, startedDays, onToggle, onStartDay }) => {
  const completed = history[selectedDate] || [];
  const currentTime = new Date();
  const isSelectedToday = isToday(new Date(selectedDate.replace(/-/g, '/')));
  const isStarted = startedDays.includes(selectedDate);
  const isLate = currentTime.getHours() >= 18; // 6:00 PM

  const calculateStreak = (habitId: string) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      if (history[dStr]?.includes(habitId)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  if (!isStarted && !isFutureDate) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-2 border-zinc-800 flex items-center justify-center text-zinc-800">
          <Play size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tighter">Execution Gate Active</h2>
          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
            Habits are visually dormant.<br/>You must explicitly commit to this day.
          </p>
        </div>
        <button 
          onClick={onStartDay}
          className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
        >
          Execute Day
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 pb-32">
      <div className="flex justify-between items-baseline mt-10 mb-2 border-b border-zinc-900 pb-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Daily Execution Units</h2>
        <span className="text-[10px] font-mono text-zinc-500 font-bold">
          {completed.length}/{FIXED_HABITS.length} COMPLETE
        </span>
      </div>

      {FIXED_HABITS.map((habit) => {
        const isCompleted = completed.includes(habit.id);
        const streak = calculateStreak(habit.id);
        const showTension = isSelectedToday && !isCompleted && isLate;

        return (
          <div 
            key={habit.id}
            onClick={() => !isFutureDate && onToggle(habit.id)}
            className={`group relative flex items-center justify-between p-6 border transition-all duration-300 cursor-pointer ${
              isCompleted 
                ? 'bg-white text-black border-white' 
                : showTension 
                  ? 'bg-zinc-950 border-red-900 shadow-[0_0_20px_rgba(255,0,0,0.1)]' 
                  : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700'
            } ${isFutureDate ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col gap-1">
              <span className={`text-lg font-black tracking-tighter uppercase leading-none ${isCompleted ? 'line-through decoration-2 opacity-30' : ''}`}>
                {habit.name}
              </span>
              <div className="flex items-center gap-4">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isCompleted ? 'text-black/40' : 'text-zinc-600'}`}>
                  Streak: {streak}D
                </span>
                {!isCompleted && streak > 0 && !isFutureDate && (
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase text-red-600 tracking-tighter">
                    <AlertTriangle size={8} />
                    Streak Damage: -{streak}
                  </div>
                )}
              </div>
            </div>

            <div className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${
              isCompleted 
                ? 'bg-black border-black' 
                : showTension
                  ? 'border-red-600 animate-pulse'
                  : 'border-zinc-800 group-hover:border-zinc-500'
            }`}>
              {isFutureDate ? (
                <Lock size={14} className="text-zinc-800" />
              ) : isCompleted ? (
                <Check size={20} className="text-white" strokeWidth={4} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
