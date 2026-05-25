/**
 * localStorage utilities for Math Trainer
 * All data is stored under the key "mathTrainerData"
 */

const STORAGE_KEY = 'mathTrainerData';

/** Returns the default empty data structure */
const defaultData = () => ({
  highestScore: 0,
  totalSessions: 0,
  history: [],          // Array of past attempt summaries
  latestAttempt: null,  // Most recent attempt details
  wrongHistory: [],     // All wrong questions ever recorded
});

/** Load data from localStorage (returns defaultData if nothing stored) */
export const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultData(), ...JSON.parse(raw) } : defaultData();
  } catch {
    return defaultData();
  }
};

/** Save the full data object to localStorage */
export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
};

/**
 * Persist a completed attempt.
 * @param {Object} attempt  { score, correct, wrong, wrongQuestions, timeTaken }
 */
export const saveAttempt = (attempt) => {
  const data = loadData();

  const entry = {
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    }),
    timestamp: Date.now(),
    score: attempt.score,
    correct: attempt.correct,
    wrong: attempt.wrong,
    timeTaken: attempt.timeTaken,
    level: attempt.level ?? 1,
    wrongQuestions: attempt.wrongQuestions ?? [],  // all first-attempt wrong (resolvedCorrectly flag inside each)
  };

  // Keep only the last 20 sessions in history
  const history = [entry, ...data.history].slice(0, 20);

  const updatedData = {
    ...data,
    highestScore: Math.max(data.highestScore, attempt.score),
    totalSessions: data.totalSessions + 1,
    history,
    latestAttempt: entry,
    wrongHistory: [
      ...data.wrongHistory,
      ...attempt.wrongQuestions,
    ].slice(-200), // cap at 200 wrong entries
  };

  saveData(updatedData);
  return updatedData;
};

/** Wipe all stored data */
export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
