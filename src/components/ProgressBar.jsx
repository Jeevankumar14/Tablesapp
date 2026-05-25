import React from 'react';

/**
 * ProgressBar — shows quiz progress (questions done / total original)
 * @param {number} current   - questions answered so far
 * @param {number} total     - total original questions (80)
 * @param {number} correct   - correct answers count
 * @param {number} wrong     - wrong answers count
 */
const ProgressBar = ({ current, total, correct, wrong }) => {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full">
      {/* Stats row */}
      <div className="flex justify-between items-center mb-2 text-xs font-medium">
        <span className="text-slate-500">
          Q <span className="text-slate-900 font-bold">{current}</span>
          <span className="hidden sm:inline"> of</span>
          <span className="sm:hidden">/</span>
          {total}
        </span>
        <div className="flex gap-3 sm:gap-4">
          <span className="text-emerald-600">✓ {correct}</span>
          <span className="text-red-600">✗ {wrong}</span>
        </div>
      </div>

      {/* Track */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Percentage label */}
      <div className="text-right mt-1 text-xs text-slate-500">{pct}%</div>
    </div>
  );
};

export default ProgressBar;
