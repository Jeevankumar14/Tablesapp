import React, { useState, useEffect, useRef, useCallback } from 'react';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import { generateQuestions, insertRetry } from '../utils/questions';

const TOTAL_TIME = 6;
const MAX_RETRIES = 3;

const QuizPage = ({ onFinish, level = 1 }) => {
  // ── render state ──────────────────────────────────────────────────────────
  const [current, setCurrent]       = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft]     = useState(TOTAL_TIME);
  const [feedback, setFeedback]     = useState(null);
  const [disabled, setDisabled]     = useState(false);
  const [queueLen, setQueueLen]     = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [correctCount, setCorrectCount]   = useState(0);
  const [wrongCount, setWrongCount]       = useState(0);

  // ── refs ─────────────────────────────────────────────────────────────────
  const queueRef               = useRef([]);
  const currentRef             = useRef(null);
  const correctRef             = useRef(0);
  const firstAttemptCorrectRef = useRef(0);
  const wrongRef               = useRef(0);
  const disabledRef            = useRef(false);
  const timerRef               = useRef(null);
  const inputRef               = useRef(null);
  const startTimeRef           = useRef(Date.now());
  const resolvedRef            = useRef(new Set());
  const wrongTrackerRef        = useRef({});
  const totalOriginalRef       = useRef(0);

  // ── init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const questions = generateQuestions(level);
    totalOriginalRef.current = questions.length;
    const rest = questions.slice(1);
    queueRef.current = rest;
    setQueueLen(rest.length);
    currentRef.current = questions[0];
    setCurrent(questions[0]);
    startTimeRef.current = Date.now();
  }, [level]);

  // ── auto-focus ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (current && !disabled) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [current, disabled]);

  // ── finish ────────────────────────────────────────────────────────────────
  const finishQuiz = useCallback(() => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const total   = totalOriginalRef.current;
    const score   = Math.round((firstAttemptCorrectRef.current / total) * 100);

    const firstAttemptWrongQs = Object.values(wrongTrackerRef.current).map(q => ({
      table: q.table,
      multiple: q.multiple,
      answer: q.answer,
      resolvedCorrectly: q.resolvedCorrectly,
      wrongAttempts: q.wrongAttempts,
    }));

    const firstCorrect = firstAttemptCorrectRef.current;
    const firstWrong   = total - firstCorrect;

    setTimeout(() => {
      onFinish({
        correct: firstCorrect,
        wrong: firstWrong,
        total,
        score,
        wrongQuestions: firstAttemptWrongQs,
        timeTaken: elapsed,
        level,
      });
    }, 600);
  }, [onFinish, level]);

  // ── advance ───────────────────────────────────────────────────────────────
  const advance = useCallback((newQueue) => {
    if (resolvedRef.current.size >= totalOriginalRef.current || newQueue.length === 0) {
      finishQuiz();
      return;
    }
    const next = newQueue[0];
    const rest = newQueue.slice(1);
    queueRef.current = rest;
    setQueueLen(rest.length);
    currentRef.current = next;
    setCurrent(next);
    setUserAnswer('');
    setFeedback(null);
    setDisabled(false);
    disabledRef.current = false;
  }, [finishQuiz]);

  // ── timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current) return;
    setTimeLeft(TOTAL_TIME);
    disabledRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!disabledRef.current) {
            disabledRef.current = true;
            setTimeout(() => handleWrong(true), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // ── correct ───────────────────────────────────────────────────────────────
  const handleCorrect = useCallback(() => {
    clearInterval(timerRef.current);
    setFeedback('correct');
    setDisabled(true);
    disabledRef.current = true;
    correctRef.current += 1;
    setCorrectCount(correctRef.current);

    const cur = currentRef.current;
    if (cur) {
      const id = cur.id;
      if (!cur.isRetry) firstAttemptCorrectRef.current += 1;
      if (!resolvedRef.current.has(id)) {
        resolvedRef.current.add(id);
        setResolvedCount(resolvedRef.current.size);
      }
      if (wrongTrackerRef.current[id]) {
        wrongTrackerRef.current[id].resolvedCorrectly = true;
      }
    }
    setTimeout(() => advance([...queueRef.current]), 700);
  }, [advance]);

  // ── wrong ─────────────────────────────────────────────────────────────────
  const handleWrong = useCallback((isTimeout = false) => {
    clearInterval(timerRef.current);
    setFeedback('wrong');
    setDisabled(true);
    disabledRef.current = true;
    wrongRef.current += 1;
    setWrongCount(wrongRef.current);

    const cur = currentRef.current;
    if (!cur) return;
    const id = cur.id;

    if (!wrongTrackerRef.current[id]) {
      wrongTrackerRef.current[id] = {
        table: cur.table, multiple: cur.multiple, answer: cur.answer,
        wrongAttempts: 0, resolvedCorrectly: false,
      };
    }
    wrongTrackerRef.current[id].wrongAttempts += 1;

    const retriesLeft = cur.isRetry ? cur.retriesLeft : MAX_RETRIES;
    let newQueue = [...queueRef.current];

    if (retriesLeft > 0) {
      newQueue = insertRetry(newQueue, { ...cur, isRetry: true, retriesLeft });
    } else {
      if (!resolvedRef.current.has(id)) {
        resolvedRef.current.add(id);
        setResolvedCount(resolvedRef.current.size);
      }
    }
    queueRef.current = newQueue;
    setQueueLen(newQueue.length);
    setTimeout(() => advance(newQueue), isTimeout ? 300 : 700);
  }, [advance]);

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (disabledRef.current || !currentRef.current) return;
    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;
    clearInterval(timerRef.current);
    disabledRef.current = true;
    if (answer === currentRef.current.answer) handleCorrect();
    else handleWrong(false);
  }, [userAnswer, handleCorrect, handleWrong]);

  const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

  // ── render ────────────────────────────────────────────────────────────────
  if (!current) {
    return (
      <div className="min-h-[100dvh] w-full bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-base animate-pulse">Calculating results…</div>
      </div>
    );
  }

  const total = totalOriginalRef.current;
  const cardBorder =
    feedback === 'correct' ? 'border-emerald-500/50' :
    feedback === 'wrong'   ? 'border-red-500/50'     : 'border-slate-200';
  const inputBorder =
    disabled
      ? feedback === 'correct' ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'
      : 'border-slate-300 focus:border-blue-500 shadow-sm';

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg animate-fade-in">

        {/* Progress */}
        <div className="mb-4 sm:mb-6">
          <ProgressBar
            current={Math.min(resolvedCount + 1, total)}
            total={total}
            correct={correctCount}
            wrong={wrongCount}
          />
          <div className="flex justify-end mt-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border text-slate-600 bg-white border-slate-200 shadow-sm">
              {level === 2 ? '⚡ Level 2 · ×10–20' : '✦ Level 1 · ×1–10'}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className={`bg-white border ${cardBorder} rounded-2xl p-4 sm:p-8 shadow-xl transition-colors duration-500`}>

          {/* Retry badge */}
          {current.isRetry && (
            <div className="flex justify-center mb-3 sm:mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-sm ${
                current.retriesLeft === 0
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}>
                🔄 Retry
                {current.retriesLeft === 0
                  ? ' · Last attempt!'
                  : ` · ${current.retriesLeft} ${current.retriesLeft !== 1 ? 'attempts' : 'attempt'} left`}
              </span>
            </div>
          )}

          {/* Timer (top-right) + Question (centered) */}
          <div className="relative flex items-center justify-center mb-6 sm:mb-8">
            {/* Timer pinned to top-right — doesn't push question */}
            <div className="absolute right-0 top-0">
              <Timer timeLeft={timeLeft} totalTime={TOTAL_TIME} disabled={disabled} />
            </div>

            {/* Question — fully centered */}
            <div className="text-center py-2">
              <div className="text-slate-500 text-xs font-medium mb-2 tracking-wide uppercase">
                What is
              </div>
              <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none py-2">
                {current.table}
                <span className="text-blue-500 mx-2">×</span>
                {current.multiple}
                <span className="text-slate-400 ml-2 text-4xl sm:text-5xl">= ?</span>
              </div>
            </div>
          </div>

          {/* Answer input */}
          <input
            ref={inputRef}
            id="answer-input"
            type="number"
            inputMode="numeric"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={disabled}
            placeholder="Your answer…"
            className={`w-full text-center text-3xl sm:text-4xl font-black rounded-xl px-4 py-4 sm:py-5 mb-3 sm:mb-4 outline-none border-2 transition-all duration-200 bg-slate-50 text-slate-900 placeholder-slate-300 ${inputBorder}`}
          />

          {/* Feedback */}
          {feedback && (
            <div className={`text-center text-sm font-semibold py-2 mb-3 sm:mb-4 rounded-lg ${
              feedback === 'correct' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
            }`}>
              {feedback === 'correct' ? '✓ Correct!' : `✗ Correct answer: ${current.answer}`}
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-submit"
            onClick={handleSubmit}
            disabled={disabled || userAnswer === ''}
            className="w-full py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg tracking-wide transition-all duration-200 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-md"
          >
            Submit Answer
          </button>
          <p className="text-center text-xs text-slate-500 mt-2 hidden sm:block">
            Press <kbd className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">Enter</kbd> to submit
          </p>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center text-xs text-slate-600">
          {queueLen} remaining · {resolvedCount}/{total} resolved
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
