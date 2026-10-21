import { z } from 'zod';

// Admin-side validation for multiple-choice game content (trivia questions and
// Name That Tune clips). Options carry an id plus text in each site language.
const optionSchema = z.object({
  id: z.string().min(1).max(20),
  textEn: z.string().trim().min(1, 'Every option needs English text').max(300),
  textSi: z.string().max(300).optional().nullable(),
  textIt: z.string().max(300).optional().nullable(),
});

const withValidAnswer = (schema) => schema.refine(
  (data) => data.options.some((o) => o.id === data.correctOption),
  { message: 'The correct answer must be one of the options', path: ['correctOption'] }
).refine(
  (data) => new Set(data.options.map((o) => o.id)).size === data.options.length,
  { message: 'Option ids must be unique', path: ['options'] }
);

export const triviaQuestionSchema = withValidAnswer(z.object({
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  questionEn: z.string().trim().min(1).max(500),
  questionSi: z.string().max(500).optional().nullable(),
  questionIt: z.string().max(500).optional().nullable(),
  options: z.array(optionSchema).min(2).max(6),
  correctOption: z.string().min(1),
  isActive: z.boolean().default(true),
}));

export const tuneClipSchema = withValidAnswer(z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleSi: z.string().max(200).optional().nullable(),
  titleIt: z.string().max(200).optional().nullable(),
  audioUrl: z.string().url().refine((url) => url.startsWith('https://'), 'Audio must be an https URL'),
  options: z.array(optionSchema).min(2).max(6),
  correctOption: z.string().min(1),
  isActive: z.boolean().default(true),
}));

/** Empty optional translations are stored as null. */
export function nullIfBlank(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
