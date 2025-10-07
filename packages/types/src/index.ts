import { z } from 'zod';

export const leaderboardModelSchema = z.object({
  id: z.string(),
  provider: z.string(),
  model: z.string(),
  inputPrice: z.number(),
  outputPrice: z.number()
});

export type LeaderboardModel = z.infer<typeof leaderboardModelSchema>;

export const providerSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  models: z.number().nonnegative(),
  website: z.string().url().optional()
});

export type ProviderSummary = z.infer<typeof providerSummarySchema>;

export const paramsSchema = z.object({
  id: z.string().min(1)
});
