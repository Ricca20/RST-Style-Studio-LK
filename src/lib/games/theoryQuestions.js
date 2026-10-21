// Theory Master question bank. Served by /api/games/theory (with isCorrect
// stripped) and used by /api/games/theory/submit to score answers.
export const THEORY_QUESTIONS = {
  western: [
    {
      id: 'w1',
      questionEn: 'Which of the following is a Major triad?',
      options: [
        { id: 'o1', textEn: 'C - E - G', isCorrect: true },
        { id: 'o2', textEn: 'C - Eb - G', isCorrect: false },
        { id: 'o3', textEn: 'C - E - G#', isCorrect: false },
        { id: 'o4', textEn: 'C - Eb - Gb', isCorrect: false },
      ],
      // For a future feature: play audio notes
      audioNotes: [261.63, 329.63, 392.00] // C, E, G
    },
    {
      id: 'w2',
      questionEn: 'How many sharps are in the D Major scale?',
      options: [
        { id: 'o1', textEn: '1 (F#)', isCorrect: false },
        { id: 'o2', textEn: '2 (F#, C#)', isCorrect: true },
        { id: 'o3', textEn: '3 (F#, C#, G#)', isCorrect: false },
        { id: 'o4', textEn: 'None', isCorrect: false },
      ]
    },
    {
      id: 'w3',
      questionEn: 'What is the relative minor of G Major?',
      options: [
        { id: 'o1', textEn: 'A minor', isCorrect: false },
        { id: 'o2', textEn: 'E minor', isCorrect: true },
        { id: 'o3', textEn: 'B minor', isCorrect: false },
        { id: 'o4', textEn: 'D minor', isCorrect: false },
      ]
    }
  ],
  eastern: [
    {
      id: 'e1',
      questionEn: 'Which Thaata corresponds to the Western Major scale?',
      options: [
        { id: 'o1', textEn: 'Bhairav', isCorrect: false },
        { id: 'o2', textEn: 'Kalyan', isCorrect: false },
        { id: 'o3', textEn: 'Bilawal', isCorrect: true },
        { id: 'o4', textEn: 'Kafi', isCorrect: false },
      ]
    },
    {
      id: 'e2',
      questionEn: 'What are the swaras in Raag Bhupali?',
      options: [
        { id: 'o1', textEn: 'Sa, Re, Ga, Pa, Dha', isCorrect: true },
        { id: 'o2', textEn: 'Sa, Ga, Ma, Dha, Ni', isCorrect: false },
        { id: 'o3', textEn: 'Sa, Re, Ma, Pa, Ni', isCorrect: false },
        { id: 'o4', textEn: 'Sa, Re, Ga, Ma, Pa, Dha, Ni', isCorrect: false },
      ],
      audioNotes: [261.63, 293.66, 329.63, 392.00, 440.00] // Sa Re Ga Pa Dha (C D E G A)
    },
    {
      id: 'e3',
      questionEn: 'Which rhythm (Taal) has 16 beats?',
      options: [
        { id: 'o1', textEn: 'Dadra', isCorrect: false },
        { id: 'o2', textEn: 'Keherwa', isCorrect: false },
        { id: 'o3', textEn: 'Teental', isCorrect: true },
        { id: 'o4', textEn: 'Roopak', isCorrect: false },
      ]
    }
  ]
};

/** questionId -> correct option id, for the given track. */
export function theoryAnswerKey(track) {
  return Object.fromEntries(
    (THEORY_QUESTIONS[track] || []).map((q) => [q.id, q.options.find((o) => o.isCorrect)?.id])
  );
}
