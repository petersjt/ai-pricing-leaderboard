export type ScraperResult = {
  provider: string;
  models: Array<{
    name: string;
    inputPrice: number;
    outputPrice: number;
  }>;
};

export * from './openai.js';
export * from './mistral.js';
export * from './anthropic.js';
