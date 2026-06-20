import React, { useState } from 'react';

const PreviousAttempts = ({ history, onClear }) => {
  const [expanded, setExpanded] = useState(-1);
  const toggle = idx => setExpanded(prev => (prev === idx ? -1 : idx));

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No previous attempts yet. Start your first quiz!
      </div>
    );
  }

  const scoreColor = s =>
    s >= 90 ? 'text-emerald-400' :
    s >= 70 ? 'text-amber-400'  : 'text-red-400';

  return (
    <div className="space-y-2">
      {/* Column headers */}
      <div className="grid grid-cols-12 gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 pb-1 border-b border-slate-200">
        <span className="col-span-4">Date</span>
        <span className="col-span-3 text-center">Score</span>
        <span className="col-span-2 text-center">✓</span>
        <span className="col-span-2 text-center">✗</span>
        <span className="col-span-1" />
      </div>

      {/* Rows */}
      <div className="max-h-60 overflow-y-auto space-y-1.5 pr-0.5">
        {history.map((entry, idx) => {
          const isOpen     = expanded === idx;
          const wrongQs    = entry.wrongQuestions ?? [];
          const hasDetails = wrongQs.length > 0;
          const levelLabel = entry.level === 3 ? 'ADV' : entry.level === 2 ? 'L2' : 'L1';

          return (
            <div key={entry.timestamp ?? idx} className="rounded-xl overflow-hidden">
              {/* Summary row */}
              <button
                onClick={() => hasDetails && toggle(idx)}
                className={`w-full grid grid-cols-12 gap-1 items-center px-2 sm:px-3 py-2.5 text-left transition-colors duration-150
                  ${idx === 0 ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-transparent'}
                  ${hasDetails ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'}
                  rounded-xl`}
              >
                {/* Date + level */}
                <div className="col-span-4 flex items-center gap-1 min-w-0">
                  <span className="text-slate-500 text-[11px] truncate">{entry.date}</span>
                  <span className="shrink-0 text-[9px] font-bold px-1 py-0.5 rounded bg-slate-200 text-slate-600 hidden sm:inline">
                    {levelLabel}
                  </span>
                </div>

                {/* Score */}
                <span className={`col-span-3 text-center font-bold text-xs sm:text-sm ${scoreColor(entry.score)}`}>
                  {entry.score}%
                </span>

                {/* Correct */}
                <span className="col-span-2 text-center text-emerald-400 font-medium text-xs sm:text-sm">
                  {entry.correct}
                </span>

                {/* Wrong + chevron */}
                <div className="col-span-2 flex items-center justify-center gap-0.5">
                  <span className="text-red-400 font-medium text-xs sm:text-sm">{entry.wrong}</span>
                </div>

                {/* Chevron */}
                <div className="col-span-1 flex justify-center">
                  {hasDetails && (
                    <span className={`text-slate-500 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  )}
                </div>
              </button>

              {/* Expandable dropdown */}
              {isOpen && hasDetails && (
                <div className="bg-white border border-slate-200 border-t-0 rounded-b-xl px-3 py-3 space-y-1.5 animate-fade-in">
                  <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-2">
                    ✗ Wrong on First Attempt ({wrongQs.length})
                  </p>
                  {wrongQs.map((q, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] border ${
                        q.resolvedCorrectly
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <span className="font-mono text-slate-700 font-bold">
                        {q.table} × {q.multiple} ={' '}
                        <span className={q.resolvedCorrectly ? 'text-emerald-600' : 'text-red-600'}>
                          {q.answer}
                        </span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full shrink-0 ml-1 text-[10px] font-medium ${
                        q.resolvedCorrectly
                          ? 'bg-orange-400 text-black'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {q.resolvedCorrectly ? `✓ Retry ${q.wrongAttempts}` : '✗ Wrong'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear button */}
      <button
        id="btn-clear-history"
        onClick={onClear}
        className="mt-1 w-full text-xs text-slate-500 hover:text-red-500 transition-colors duration-200 py-2.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg"
      >
        Clear History
      </button>
    </div>
  );
};

export default PreviousAttempts;
