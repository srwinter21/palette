import { z } from 'zod';
import { generationResultSchema } from './schema';

export const api = {
  generate: {
    create: {
      method: 'POST' as const,
      path: '/api/generate',
      input: z.object({
        budgetTier: z.enum(["budget", "mid", "luxury"]),
      }),
      responses: {
        200: generationResultSchema,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
