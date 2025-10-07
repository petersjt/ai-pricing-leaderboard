import type { ScraperResult } from './index.js';

export async function fetchOpenAiPricing(): Promise<ScraperResult> {
  return {
    provider: 'OpenAI',
    models: []
  };
}
