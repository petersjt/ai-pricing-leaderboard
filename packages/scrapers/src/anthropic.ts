import type { ScraperResult } from './index.js';

export async function fetchAnthropicPricing(): Promise<ScraperResult> {
  return {
    provider: 'Anthropic',
    models: []
  };
}
