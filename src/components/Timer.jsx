import React, { useEffect, useRef } from 'react';

/**
 * Timer — circular countdown for each question (6 seconds)
 * @param {number}   timeLeft   - seconds remaining
 * @param {number}   totalTime  - total seconds (6)
 * @param {boolean}  disabled   - true after timeout to stop rendering active state
 */
const Timer = ({ timeLeft, totalTime = 6, disabled = false }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = disabled ? 0 : (timeLeft / totalTime) * circumference;

  // Color transitions: green → yellow → red
  const getColor = () => {
    if (timeLeft > 4) return '#10b981'; // emerald
    if (timeLeft > 2) return '#f59e0b'; // amber
    return '#ef4444';                   // red
  };

  const color = getColor();
  const isUrgent = timeLeft <= 2 && !disabled;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative flex items-center justify-center ${isUrgent ? 'animate-pulse' : ''}`}
        style={{ width: 60, height: 60 }}
      >
        {/* Background circle */}
        <svg width="60" height="60" className="absolute inset-0 -rotate-90" viewBox="0 0 60 60">
          <circle
            cx="30" cy="30" r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="5"
          />
          {/* Progress arc */}
          <circle
            cx="30" cy="30" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
          />
        </svg>

        {/* Digit */}
        <span
          className="relative z-10 text-lg font-black tabular-nums"
          style={{ color }}
        >
          {disabled ? '—' : timeLeft}
        </span>
      </div>
      <span className="text-xs text-slate-500 tracking-wide">secs</span>
    </div>
  );
};

export default Timer;
