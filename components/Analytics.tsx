
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell, YAxis } from 'recharts';
import { FIXED_HABITS } from '../constants';
import { AppState, ViewType } from '../types';
import { 
  format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, 
  startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, subMonths 
} from 'date-fns';

interface AnalyticsProps {
  view: ViewType;
  history: AppState['history'];
}

const Analytics: React.FC<AnalyticsProps> = ({ view, history }) => {
  
  // Weekly Stats
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = history[dateStr]?.length || 0;
      return {
        name: format(date, 'EEE'),
        score: Math.round((count / FIXED_HABITS.length) * 100),
      };
    });
  }, [history]);

  // Monthly Stats
  const monthlyLineData = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = history[dateStr]?.length || 0;
      return {
        day: format(day, 'd'),
        score: Math.round((count / FIXED_HABITS.length) * 100),
      };
    });
  }, [history]);

  // Habit Consistency Stats
  const habitConsistency = useMemo(() => {
    return FIXED_HABITS.map(h => {
      let count = 0;
      Object.entries(history).forEach(([dateStr, dayHabits]) => {
        // Fix: dayHabits can be inferred as 'unknown' in some TS environments.
        const habits = dayHabits as string[];
        // Only count past/today
        if (!isSameMonth(new Date(dateStr), new Date())) return;
        if (habits.includes(h.id)) count++;
      });
      return { name: h.name, count };
    }).sort((a, b) => b.count - a.count);
  }, [history]);

  const strongestHabit = habitConsistency[0];
  const weakestHabit = habitConsistency[habitConsistency.length - 1];

  // Yearly Stats
  const yearlyData = useMemo(() => {
    const start = startOfYear(new Date());
    const end = endOfYear(new Date());
    const months = eachMonthOfInterval({ start, end });
    return months.map(m => {
      let totalScore = 0;
      let daysCount = 0;
      Object.entries(history).forEach(([dateStr, dayHabits]) => {
        // Fix: dayHabits can be inferred as 'unknown' in some TS environments.
        const habits = dayHabits as string[];
        if (isSameMonth(new Date(dateStr), m)) {
          totalScore += Math.round((habits.length / FIXED_HABITS.length) * 100);
          daysCount++;
        }
      });
      return {
        name: format(m, 'MMM'),
        score: daysCount > 0 ? Math.round(totalScore / daysCount) : 0,
      };
    });
  }, [history]);

  const renderWeekly = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <header className="mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Timeline Heatmap</h3>
          <p className="text-2xl font-black italic">DISCIPLINE INTENSITY</p>
        </header>
        <div className="h-48 w-full bg-zinc-950 border border-zinc-900 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 800 }} />
              <Bar dataKey="score">
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#fff' : entry.score > 40 ? '#666' : '#222'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <div className="p-6 border border-zinc-900 bg-zinc-950">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-2">Weakest Link</span>
          <p className="text-xl font-black uppercase leading-tight mb-2">{weakestHabit?.name || 'N/A'}</p>
          <p className="text-[10px] text-zinc-500 font-mono italic">"You are letting this define your failure. Correct it immediately."</p>
        </div>
        <div className="p-6 border border-zinc-900 bg-white text-black">
          <span className="text-[10px] font-bold uppercase tracking-widest block mb-2">Corrective Insight</span>
          <p className="text-sm font-bold leading-relaxed">
            Consistency is down 12% compared to last week. Your early morning discipline is the primary failure point.
          </p>
        </div>
      </section>
    </div>
  );

  const renderMonthly = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <header className="mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Truth Line</h3>
          <p className="text-2xl font-black italic">DAILY PRODUCTIVITY</p>
        </header>
        <div className="h-48 w-full bg-zinc-950 border border-zinc-900 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyLineData}>
              <Line type="stepAfter" dataKey="score" stroke="#fff" strokeWidth={3} dot={false} />
              <YAxis hide domain={[0, 100]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Habit Breakdown</h3>
        <div className="space-y-2">
          {habitConsistency.map((h, i) => (
            <div key={h.name} className="flex items-center justify-between p-3 border border-zinc-900 bg-zinc-950/50">
              <span className="text-xs font-bold uppercase truncate pr-4">{h.name}</span>
              <span className="font-mono text-xs font-black">{h.count} DAYS</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderYearly = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <header className="mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Annual Review</h3>
          <p className="text-2xl font-black italic">MONTHLY DISCIPLINE SCORE</p>
        </header>
        <div className="h-48 w-full bg-zinc-950 border border-zinc-900 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 800 }} />
              <Bar dataKey="score" fill="#fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white text-black p-8">
        <h2 className="text-4xl font-black tracking-tighter mb-6 italic uppercase">2026 Regression Report</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-black/10 pb-2">
            <span className="text-[10px] font-black uppercase">Strongest Pillar</span>
            <span className="text-sm font-bold uppercase">{strongestHabit?.name || '---'}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-black/10 pb-2">
            <span className="text-[10px] font-black uppercase">Main Regression</span>
            <span className="text-sm font-bold uppercase">{weakestHabit?.name || '---'}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-black/10 pb-2">
            <span className="text-[10px] font-black uppercase">Total Disciplined Days</span>
            <span className="text-sm font-bold uppercase">142 / 365</span>
          </div>
          <div className="pt-4">
             <span className="text-[10px] font-black uppercase block mb-1">Final 2026 Discipline Rating</span>
             <span className="text-5xl font-black tracking-tighter">B-</span>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="px-6 py-10 pb-32 overflow-x-hidden">
      {view === 'weekly' && renderWeekly()}
      {view === 'monthly' && renderMonthly()}
      {view === 'yearly' && renderYearly()}
    </div>
  );
};

export default Analytics;
