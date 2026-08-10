import { NextResponse } from 'next/server';

const theoryQuestions = {
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track'); // 'western' or 'eastern'

    if (!track || !['western', 'eastern'].includes(track)) {
      return NextResponse.json({ error: 'Valid track parameter is required' }, { status: 400 });
    }

    const questions = theoryQuestions[track];

    // Strip out the isCorrect boolean before sending to client for anti-cheat
    // In a real app we'd score this on the server like Trivia, but for MVP we will send it for quick client evaluation,
    // or just return the stripped version and implement a submit route.
    // Given time constraints, we'll send it but obfuscated or just accept client trust for this specific theory game MVP.
    // Let's strip it and implement a quick submit route.
    const sanitized = questions.map(q => ({
      ...q,
      options: q.options.map(o => ({ id: o.id, textEn: o.textEn }))
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch theory questions' }, { status: 500 });
  }
}
