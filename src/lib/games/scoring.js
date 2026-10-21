/**
 * Keeps only the first answer submitted for each question. Without this a client
 * could repeat one correct answer many times in a single payload to inflate its score.
 */
export function uniqueAnswers(answers, idKey) {
  const seen = new Set();
  return answers.filter((answer) => {
    const id = answer[idKey];
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
