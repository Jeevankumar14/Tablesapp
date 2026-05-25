import React from 'react';

const ResultPage = ({ result, onRestart, onHome }) => {
  const {
    correct, wrong, total, score,
    wrongQuestions = [],
    timeTaken, level,
  } = result;

  const grade =
    score >= 95 ? { label: 'Outstanding! 🏆', color: 'text-emerald-400', bg: 'from-emerald-900/40 to-teal-900/30',   border: 'border-emerald-700/40' } :
    score >= 85 ? { label: 'Excellent! ⭐',   color: 'text-indigo-400',  bg: 'from-indigo-900/40 to-violet-900/30', border: 'border-indigo-700/40'  } :
    score >= 70 ? { label: 'Good Job! 👍',    color: 'text-amber-400',   bg: 'from-amber-900/30 to-orange-900/20',  border: 'border-amber-700/40'   } :
                  { label: 'Keep Practising', color: 'text-red-400',     bg: 'from-red-900/30 to-rose-900/20',      border: 'border-red-700/40'     };

  const formatTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md animate-fade-in space-y-3 sm:space-y-5">

        {/* Score card */}
        <div className={`bg-gradient-to-br ${grade.bg} border ${grade.border} rounded-2xl p-6 sm:p-8 text-center shadow-2xl`}>
          <div className={`text-5xl sm:text-6xl font-black mb-1 ${grade.color}`}>{score}%</div>
          <div className={`text-base sm:text-lg font-semibold ${grade.color} mb-1`}>{grade.label}</div>
          <div className="text-slate-400 text-xs sm:text-sm mb-2">Quiz complete · {total} questions</div>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
            level === 2
              ? 'text-violet-400 bg-violet-950/40 border-violet-800/40'
              : 'text-indigo-400 bg-indigo-950/40 border-indigo-800/40'
          }`}>
            {level === 2 ? '⚡ Level 2 · ×10–20' : '✦ Level 1 · ×1–10'}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { label: 'Correct (1st attempt)', value: correct, color: 'text-emerald-400' },
            { label: 'Wrong (1st attempt)',   value: wrong,   color: 'text-red-400'     },
            { label: 'Total Questions',       value: total,   color: 'text-white'       },
            { label: 'Time Taken',            value: formatTime(timeTaken), color: 'text-indigo-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
              <div className={`text-xl sm:text-2xl font-black ${color}`}>{value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Wrong on first attempt */}
        {wrongQuestions.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
              ✗ Wrong on First Attempt ({wrongQuestions.length})
            </h2>
            <div className="space-y-2 max-h-52 sm:max-h-56 overflow-y-auto pr-1">
              {wrongQuestions.map((q, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm border ${
                    q.resolvedCorrectly
                      ? 'bg-amber-950/20 border-amber-900/30'
                      : 'bg-red-950/20 border-red-900/30'
                  }`}
                >
                  <span className="font-mono font-bold text-slate-300 truncate mr-2">
                    {q.table} × {q.multiple} ={' '}
                    <span className={q.resolvedCorrectly ? 'text-emerald-400' : 'text-red-400'}>
                      {q.answer}
                    </span>
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                    q.resolvedCorrectly
                      ? 'bg-amber-900/40 text-amber-400'
                      : 'bg-red-900/40 text-red-400'
                  }`}>
                    {q.resolvedCorrectly ? '✓ Fixed' : '✗ Wrong'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongQuestions.length === 0 && (
          <div className="text-center py-3 text-emerald-400 font-semibold text-sm">
            🎉 Perfect — all correct on the first attempt!
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            id="btn-restart"
            onClick={onRestart}
            className="py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide transition-all duration-200 active:scale-[0.97] shadow-lg shadow-indigo-900/40 text-sm sm:text-base"
          >
            Play Again
          </button>
          <button
            id="btn-home"
            onClick={onHome}
            className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold tracking-wide transition-all duration-200 active:scale-[0.97] border border-slate-700 text-sm sm:text-base"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
