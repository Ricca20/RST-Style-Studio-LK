import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  role: z.string().max(200).optional().nullable(),
  quote: z.string().trim().min(1, 'Quote is required').max(1000),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable().or(z.literal('').transform(() => null)),
  imageUrl: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});
