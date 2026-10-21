'use client';

import ChoiceContentManager from './ChoiceContentManager';

const DIFFICULTY_STYLES = {
  EASY: 'border-green-200 text-green-700 bg-green-50',
  MEDIUM: 'border-yellow-200 text-yellow-700 bg-yellow-50',
  HARD: 'border-red-200 text-red-700 bg-red-50',
};

export default function AdminTriviaManager() {
  return (
    <ChoiceContentManager
      title="Trivia Database"
      itemLabel="Question"
      endpoint="/api/admin/games/trivia"
      promptField="question"
      promptLabel="Question"
      extraDefaults={{ difficulty: 'EASY' }}
      renderExtraFields={(formData, update) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => update({ difficulty: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="EASY">Easy (10 pts)</option>
            <option value="MEDIUM">Medium (15 pts)</option>
            <option value="HARD">Hard (20 pts)</option>
          </select>
        </div>
      )}
      extraColumnLabel="Difficulty"
      renderExtraCell={(q) => (
        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${DIFFICULTY_STYLES[q.difficulty] || ''}`}>
          {q.difficulty}
        </span>
      )}
    />
  );
}
