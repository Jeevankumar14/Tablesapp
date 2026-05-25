import React, { useState, useCallback } from 'react';
import HomePage   from './pages/HomePage';
import QuizPage   from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import { saveAttempt } from './utils/storage';

/**
 * App — top-level router
 * Views: 'home' | 'quiz' | 'result'
 */
const App = () => {
  const [view, setView]     = useState('home');
  const [result, setResult] = useState(null);
  const [level, setLevel]   = useState(1);         // 1 or 2
  const [quizKey, setQuizKey] = useState(0);

  /** Called by QuizPage when all questions are exhausted */
  const handleFinish = useCallback((raw) => {
    // raw.score is already computed in QuizPage based on correct total questions
    const attempt = { ...raw };
    saveAttempt(attempt);
    setResult(attempt);
    setView('result');
  }, []);

  /** Restart: mount a fresh QuizPage */
  const handleRestart = useCallback(() => {
    setResult(null);
    setQuizKey((k) => k + 1);
    setView('quiz');
  }, []);

  /** Go home (refresh home data from localStorage) */
  const handleHome = useCallback(() => {
    setResult(null);
    setView('home');
  }, []);

  return (
    <>
      {view === 'home'   && <HomePage onStart={(lvl) => { setLevel(lvl); setQuizKey((k) => k + 1); setView('quiz'); }} />}
      {view === 'quiz'   && <QuizPage key={quizKey} level={level} onFinish={handleFinish} />}
      {view === 'result' && <ResultPage result={result} onRestart={handleRestart} onHome={handleHome} />}
    </>
  );
};

export default App;
