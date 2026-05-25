import React, { useState, useEffect } from 'react';
import PreviousAttempts from '../components/PreviousAttempts';
import { loadData, clearHistory } from '../utils/storage';
import appLogo from '../assets/app.jpg';

const HomePage = ({ onStart }) => {
  const [data, setData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(1);

  useEffect(() => { setData(loadData()); }, []);

  const handleClear = () => {
    if (window.confirm('Clear all history? This cannot be undone.')) {
      clearHistory();
      setData(loadData());
    }
  };

  const highestColor =
    !data || data.highestScore === 0 ? 'text-slate-400' :
    data.highestScore >= 90 ? 'text-emerald-400' :
    data.highestScore >= 70 ? 'text-amber-400' : 'text-red-400';

  const lastScore = data?.latestAttempt?.score ?? null;
  const lastColor =
    lastScore === null ? 'text-slate-400' :
    lastScore >= 90 ? 'text-emerald-400' :
    lastScore >= 70 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-xl animate-fade-in">

        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 mb-4 sm:mb-6 text-center shadow-lg">

          {/* Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <img 
              src={appLogo} 
              alt="MathTrainer Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm object-cover border border-slate-200"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tight">
            Math<span className="text-blue-600">Trainer</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
            Master tables 12 – 19 · 80 questions · 6 seconds each
          </p>

          {/* Stats strip */}
          {data && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { label: 'Best score',    value: data.highestScore > 0 ? `${data.highestScore}%` : '—', color: highestColor },
                { label: 'Sessions',      value: data.totalSessions,                                     color: 'text-slate-900'  },
                { label: 'Last score',    value: lastScore !== null ? `${lastScore}%` : '—',             color: lastColor     },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-100 rounded-xl p-2 sm:p-3">
                  <div className={`text-lg sm:text-xl font-black ${color}`}>{value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Level selector */}
          <div className="mb-4 sm:mb-5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 text-center">
              Select Level
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <button
                id="btn-level-1"
                onClick={() => setSelectedLevel(1)}
                className={`py-3 sm:py-4 rounded-xl font-bold text-sm tracking-wide border-2 transition-all duration-200 ${
                  selectedLevel === 1
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                Level 1
                <span className="block text-[11px] font-normal opacity-80 mt-0.5">Multiples 1 – 10</span>
              </button>
              <button
                id="btn-level-2"
                onClick={() => setSelectedLevel(2)}
                className={`py-3 sm:py-4 rounded-xl font-bold text-sm tracking-wide border-2 transition-all duration-200 ${
                  selectedLevel === 2
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                Level 2
                <span className="block text-[11px] font-normal opacity-80 mt-0.5">Multiples 10 – 20</span>
              </button>
            </div>
          </div>

          {/* Start */}
          <button
            id="btn-start-quiz"
            onClick={() => onStart(selectedLevel)}
            className="w-full py-4 sm:py-5 rounded-xl text-black font-bold text-base sm:text-lg tracking-wide shadow-md transition-all duration-200 active:scale-[0.98] bg-yellow-400 hover:bg-yellow-300"
          >
            Start Quiz →
          </button>
        </div>

        {/* Previous attempts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 sm:mb-4">
            Previous Attempts
          </h2>
          <PreviousAttempts history={data?.history ?? []} onClear={handleClear} />
        </div>

        <div className="mt-3 text-center text-[11px] text-slate-600 space-y-0.5">
          <p>Tables 12–19 · Wrong answers retry up to 3×</p>
          <p>All data saved locally · No login needed</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
