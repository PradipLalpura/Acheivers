
import React, { useState, useEffect, useMemo } from 'react';
import Timeline from './components/Timeline';
import HabitList from './components/HabitList';
import Analytics from './components/Analytics';
import PressureModule from './components/PressureModule';
import { FIXED_HABITS, CATEGORIZED_QUOTES, V2_QUOTES } from './constants';
import { loadState, saveState } from './services/storage';
import { getTodayStr, formatDateDisplay, isFuture } from './utils/dateUtils';
import { AppState, ViewType } from './types';
import { LayoutDashboard, Target, CalendarDays, TrendingUp, Award, User, Lock } from 'lucide-react';
import { isToday } from 'date-fns';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [history, setHistory] = useState<AppState['history']>({});
  const [startedDays, setStartedDays] = useState<string[]>([]);
  const [view, setView] = useState<ViewType>('daily');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialization
  useEffect(() => {
    const saved = loadState();
    setHistory(saved.history);
    setStartedDays(saved.startedDays);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persistent storage
  useEffect(() => {
    saveState({ history, startedDays });
  }, [history, startedDays]);

  const handleToggleHabit = (habitId: string) => {
    setHistory(prev => {
      const current = prev[selectedDate] || [];
      const updated = current.includes(habitId) 
        ? current.filter(id => id !== habitId)
        : [...current, habitId];
      
      return { ...prev, [selectedDate]: updated };
    });
  };

  const handleStartDay = () => {
    if (!startedDays.includes(selectedDate)) {
      setStartedDays(prev => [...prev, selectedDate]);
    }
  };

  const productivityScore = useMemo(() => {
    const completed = history[selectedDate]?.length || 0;
    return Math.round((completed / FIXED_HABITS.length) * 100);
  }, [history, selectedDate]);

  const isSelectedToday = useMemo(() => isToday(new Date(selectedDate.replace(/-/g, '/'))), [selectedDate]);
  const isSelectedFuture = isFuture(selectedDate);
  const isStarted = startedDays.includes(selectedDate);

  // Status Language Logic
  const statusLanguage = useMemo(() => {
    if (isSelectedFuture) return "LOCKED";
    if (!isStarted) return "DORMANT";
    if (productivityScore === 100) return "EXECUTED";
    if (productivityScore > 0) return "IN PROGRESS";
    
    if (isSelectedToday) {
      const hour = currentTime.getHours();
      if (hour < 10) return "UNSTARTED";
      if (hour < 18) return "NO ACTION TAKEN";
      return "DISCIPLINE NOT EARNED";
    }
    return "FAILURE";
  }, [productivityScore, isSelectedToday, currentTime, isSelectedFuture, isStarted]);

  // V2 Contextual State-Aware Quote Selection
  const activeQuote = useMemo(() => {
    const hash = new Date(selectedDate.replace(/-/g, '/')).getDate();
    
    if (productivityScore === 100) {
      return CATEGORIZED_QUOTES.acknowledged[hash % CATEGORIZED_QUOTES.acknowledged.length];
    }
    
    // Time-based if score is not perfect
    const hour = currentTime.getHours();
    if (hour < 12) return V2_QUOTES.morning[hash % V2_QUOTES.morning.length];
    if (hour < 19) return V2_QUOTES.midday[hash % V2_QUOTES.midday.length];
    return V2_QUOTES.night[hash % V2_QUOTES.night.length];
  }, [productivityScore, selectedDate, currentTime]);

  const renderDailyContent = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score & Quote Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-900 border-y border-zinc-900">
        <div className="px-6 py-12 bg-black flex flex-col justify-center">
          <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-2">Performance Index</span>
          <div className="flex items-baseline gap-4">
            <span className="text-8xl font-black tracking-tighter leading-none transition-all duration-300">
              {productivityScore}%
            </span>
            <div className="flex flex-col">
              <span className={`text-xs font-black uppercase tracking-widest ${productivityScore >= 80 ? 'text-white' : 'text-zinc-600'}`}>
                {statusLanguage}
              </span>
              <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-tighter">Active Meter</span>
            </div>
          </div>
          {/* Live Progress Bar */}
          <div className="w-full h-1 bg-zinc-900 mt-8 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>

        <div className="px-6 py-12 bg-zinc-950 flex flex-col justify-center border-l border-zinc-900">
          <div className="w-8 h-1 bg-white mb-6" />
          <p className="text-2xl font-black italic leading-[1.1] uppercase tracking-tighter max-w-xs">
            "{activeQuote}"
          </p>
        </div>
      </div>

      <HabitList 
        selectedDate={selectedDate} 
        isFutureDate={isSelectedFuture}
        history={history}
        startedDays={startedDays}
        onToggle={handleToggleHabit}
        onStartDay={handleStartDay}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-full relative selection:bg-white selection:text-black font-['Inter']">
      
      {/* Desktop Wrapper Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col border-x border-zinc-900 bg-black min-h-screen pb-24 lg:pb-0">
          
          <header className="px-6 pt-16 pb-8 bg-black">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Achievers</h1>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 font-black uppercase">V2</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest border border-zinc-800">
                <User size={12} /> System Admin
              </div>
            </div>
            <p className="text-sm font-black text-white uppercase tracking-[0.1em] font-mono border-l-2 border-white pl-3">
              {formatDateDisplay(new Date(selectedDate.replace(/-/g, '/')))}
            </p>
          </header>

          <Timeline 
            selectedDate={selectedDate} 
            onDateSelect={(d) => {
              setSelectedDate(d);
              setView('daily');
            }} 
            history={history}
            startedDays={startedDays}
          />

          <main className="flex-1 overflow-y-auto no-scrollbar">
            {view === 'daily' ? renderDailyContent() : <Analytics view={view} history={history} />}
          </main>
        </div>

        {/* Desktop Side Panel - Contextual Pressure Module */}
        <aside className="hidden lg:flex flex-col w-[400px] border-r border-zinc-900 bg-black p-10 space-y-12 overflow-y-auto no-scrollbar">
          <PressureModule score={productivityScore} />
          
          <div className="flex-1" />
          
          <div className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest border-t border-zinc-900 pt-6">
            ACHIEVERS OS v2.1.0_STABLE<br/>
            STATUS: ACTIVE MONITORING
          </div>
        </aside>
      </div>

      {/* Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-zinc-900 pt-4 pb-8 px-6 lg:px-12 z-50">
        <div className="max-w-md lg:max-w-2xl mx-auto grid grid-cols-4 gap-4 items-center">
          <button 
            onClick={() => setView('daily')}
            className={`flex flex-col items-center gap-1.5 transition-all ${view === 'daily' ? 'text-white scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
          >
            <Target size={24} strokeWidth={view === 'daily' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Execute</span>
          </button>
          <button 
            onClick={() => setView('weekly')}
            className={`flex flex-col items-center gap-1.5 transition-all ${view === 'weekly' ? 'text-white scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
          >
            <LayoutDashboard size={24} strokeWidth={view === 'weekly' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Weekly</span>
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`flex flex-col items-center gap-1.5 transition-all ${view === 'monthly' ? 'text-white scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
          >
            <TrendingUp size={24} strokeWidth={view === 'monthly' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Monthly</span>
          </button>
          <button 
            onClick={() => setView('yearly')}
            className={`flex flex-col items-center gap-1.5 transition-all ${view === 'yearly' ? 'text-white scale-110' : 'text-zinc-700 hover:text-zinc-500'}`}
          >
            <Award size={24} strokeWidth={view === 'yearly' ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Yearly</span>
          </button>
        </div>
      </nav>

      {/* Reset to Today FAB */}
      {!isSelectedToday && (
        <button 
          onClick={() => {
            setSelectedDate(getTodayStr());
            setView('daily');
          }}
          className="fixed bottom-28 right-8 w-14 h-14 bg-white text-black flex items-center justify-center rounded-none shadow-[0_20px_40px_rgba(255,255,255,0.1)] z-40 animate-in zoom-in-50 duration-300 active:scale-95"
        >
          <CalendarDays size={24} />
        </button>
      )}
    </div>
  );
};

export default App;
