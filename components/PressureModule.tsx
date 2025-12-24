
import React, { useState, useEffect } from 'react';
import { differenceInSeconds, endOfDay, format } from 'date-fns';

interface PressureModuleProps {
  score: number;
}

const PressureModule: React.FC<PressureModuleProps> = ({ score }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = endOfDay(now);
      const diff = differenceInSeconds(end, now);
      
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Daily Countdown</h3>
        <p className="text-4xl font-black font-mono tracking-tighter text-white">{timeLeft}</p>
        <p className="text-[9px] font-bold text-zinc-700 uppercase">Seconds remaining for execution</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Consequence Awareness</h3>
        <div className="p-4 border border-zinc-900 bg-zinc-950 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-zinc-500">History Status</span>
            <span className={`text-[10px] font-black uppercase ${score < 100 ? 'text-red-500' : 'text-green-500'}`}>
              {score < 100 ? 'Incomplete' : 'Verified'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-medium leading-tight italic">
            "Every missed box is a permanent mark on your history. There is no edit button for yesterday."
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Discipline Reminder</h3>
        <p className="text-sm font-bold text-zinc-400 leading-relaxed uppercase">
          Motivation is a feeling. Discipline is an operating system. Feelings are unreliable. Systems are absolute.
        </p>
      </div>
    </div>
  );
};

export default PressureModule;
