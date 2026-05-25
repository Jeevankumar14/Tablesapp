/**
 * Question generation & retry queue utilities
 */

/**
 * Generate all 80 original questions.
 * @param {1|2} level  - 1 → multiples 1–10, 2 → multiples 10–20
 */
export const generateQuestions = (level = 1) => {
  const multipleStart = level === 2 ? 10 : 1;
  const multipleEnd   = level === 2 ? 20 : 10;
  const questions = [];
  for (let table = 12; table <= 19; table++) {
    for (let multiple = multipleStart; multiple <= multipleEnd; multiple++) {
      questions.push({
        id: `${table}x${multiple}`,
        table,
        multiple,
        answer: table * multiple,
        isRetry: false,
        retriesLeft: 0,
      });
    }
  }
  return shuffle(questions);
};

/** Fisher-Yates shuffle (returns a new array) */
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Insert a retry question into the queue at a random position
 * that is at least `minGap` slots ahead of the current index.
 *
 * @param {Array}  queue       - current remaining question queue
 * @param {Object} question    - the question to insert as a retry
 * @param {number} minGap      - minimum questions to skip before reinserting
 * @returns {Array}            - new queue with retry inserted
 */
export const insertRetry = (queue, question, minGap = 3) => {
  const retryQ = {
    ...question,
    isRetry: true,
    retriesLeft: question.retriesLeft - 1,
  };

  const newQueue = [...queue];

  // Earliest safe position to insert (skip at least `minGap` questions)
  const earliest = Math.min(minGap, newQueue.length);
  // Random position between earliest and end of queue
  const insertAt =
    earliest + Math.floor(Math.random() * Math.max(1, newQueue.length - earliest + 1));

  newQueue.splice(insertAt, 0, retryQ);
  return newQueue;
};

/**
 * Build initial retry entry for a wrong question.
 * @param {Object} question - question that was answered wrong
 * @param {number} maxRetries
 */
export const makeRetryQuestion = (question, maxRetries = 3) => ({
  ...question,
  isRetry: true,
  retriesLeft: maxRetries - 1, // first retry is about to happen
});
