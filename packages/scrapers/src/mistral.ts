import type { ScraperResult } from './index.js';

export async function fetchMistralPricing(): Promise<ScraperResult> {
  return {
    provider: 'Mistral',
    models: []
  };
}
