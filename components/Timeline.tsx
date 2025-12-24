
import React, { useRef, useEffect } from 'react';
import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { isFuture, getTodayStr } from '../utils/dateUtils';
import { FIXED_HABITS } from '../constants';
import { AppState } from '../types';

interface TimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  history: AppState['history'];
  startedDays: string[];
}

const Timeline: React.FC<TimelineProps> = ({ selectedDate, onDateSelect, history, startedDays }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Range: 60 days past, 7 days future
  const dates = [];
  const startOffset = -60;
  const endOffset = 7;
  for (let i = startOffset; i <= endOffset; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-date');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'auto', inline: 'center' });
      }
    }
  }, [selectedDate]);

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto py-6 px-4 gap-3 no-scrollbar items-end border-b border-zinc-900 bg-black/95 backdrop-blur-md sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      {dates.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isActive = dateStr === selectedDate;
        const future = isFuture(dateStr);
        const today = isToday(date);
        const dayLabel = format(date, 'EEE');
        const dateLabel = format(date, 'd');

        const isStarted = startedDays.includes(dateStr);
        const completedCount = history[dateStr]?.length || 0;
        const isFailure = isBefore(startOfDay(date), startOfDay(new Date())) && 
                          (!isStarted || completedCount < FIXED_HABITS.length);

        return (
          <button
            key={dateStr}
            onClick={() => !future && onDateSelect(dateStr)}
            className={`flex flex-col items-center min-w-[58px] transition-all duration-300 no-select group ${
              isActive ? 'active-date scale-105' : 'opacity-60 hover:opacity-100'
            } ${future ? 'locked-day' : ''}`}
          >
            <span className={`text-[10px] uppercase font-black tracking-widest mb-1.5 ${
              today ? 'text-white' : isFailure ? 'text-red-500' : 'text-zinc-400'
            }`}>
              {today ? 'TODAY' : isFailure ? 'FAIL' : dayLabel}
            </span>
            <div className={`relative w-14 h-14 flex items-center justify-center rounded-none border-2 transition-all ${
              isActive 
                ? 'bg-white text-black border-white font-black text-xl' 
                : isFailure
                  ? 'border-red-900 text-red-500 bg-red-950/20'
                  : today 
                    ? 'border-zinc-400 text-white font-black' 
                    : 'border-zinc-800 text-zinc-300 hover:border-zinc-500'
            }`}>
              {dateLabel}
              {today && !isActive && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full ring-4 ring-black" />
              )}
              {isFailure && !isActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-red-600/50 rotate-45" />
                  <div className="w-full h-[1px] bg-red-600/50 -rotate-45 absolute" />
                </div>
              )}
            </div>
            {isActive && <div className={`w-6 h-1 mt-2 ${isFailure ? 'bg-red-500' : 'bg-white'}`} />}
          </button>
        );
      })}
    </div>
  );
};

export default Timeline;
