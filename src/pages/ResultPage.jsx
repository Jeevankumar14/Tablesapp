import React from 'react';

const ResultPage = ({ result, onRestart, onHome }) => {
  const {
    correct, wrong, total, score,
    wrongQuestions = [],
    timeTaken, level,
  } = result;

  const grade =
    score >= 95 ? { label: 'Outstanding! 🏆', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' } :
    score >= 85 ? { label: 'Excellent! ⭐',   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'  } :
    score >= 70 ? { label: 'Good Job! 👍',    color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   } :
                  { label: 'Keep Practising', color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'     };

  const formatTime = sec => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg animate-fade-in space-y-4 sm:space-y-6">

        {/* Score card */}
        <div className={`${grade.bg} border ${grade.border} rounded-2xl p-6 sm:p-8 text-center shadow-sm`}>
          <div className={`text-5xl sm:text-6xl font-black mb-1 ${grade.color}`}>{score}%</div>
          <div className={`text-base sm:text-lg font-semibold ${grade.color} mb-1`}>{grade.label}</div>
          <div className="text-slate-400 text-xs sm:text-sm mb-2">Quiz complete · {total} questions</div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border text-slate-600 bg-white border-slate-200">
            {level === 2 ? '⚡ Level 2 · ×10–20' : '✦ Level 1 · ×1–10'}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { label: 'Correct (1st attempt)', value: correct, color: 'text-emerald-500' },
            { label: 'Wrong (1st attempt)',   value: wrong,   color: 'text-red-500'     },
            { label: 'Total Questions',       value: total,   color: 'text-slate-900'       },
            { label: 'Time Taken',            value: formatTime(timeTaken), color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
              <div className={`text-xl sm:text-2xl font-black ${color}`}>{value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Wrong on first attempt */}
        {wrongQuestions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
              ✗ Wrong on First Attempt ({wrongQuestions.length})
            </h2>
            <div className="space-y-2 max-h-52 sm:max-h-56 overflow-y-auto pr-1">
              {wrongQuestions.map((q, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm border ${
                    q.resolvedCorrectly
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="font-mono font-bold text-slate-700 truncate mr-2">
                    {q.table} × {q.multiple} ={' '}
                    <span className={q.resolvedCorrectly ? 'text-emerald-400' : 'text-red-400'}>
                      {q.answer}
                    </span>
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap font-medium ${
                    q.resolvedCorrectly
                      ? 'bg-orange-400 text-black'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {q.resolvedCorrectly ? `✓ Retry ${q.wrongAttempts}` : '✗ Wrong'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongQuestions.length === 0 && (
          <div className="text-center py-3 text-emerald-600 font-semibold text-sm">
            🎉 Perfect — all correct on the first attempt!
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            id="btn-restart"
            onClick={onRestart}
            className="py-4 sm:py-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-md text-sm sm:text-base"
          >
            Play Again
          </button>
          <button
            id="btn-home"
            onClick={onHome}
            className="py-4 sm:py-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold tracking-wide transition-all duration-200 active:scale-[0.98] border border-slate-200 text-sm sm:text-base shadow-sm"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
