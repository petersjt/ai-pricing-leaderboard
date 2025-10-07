import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const providers = [
  {
    name: 'OpenAI',
    slug: 'openai',
    website: 'https://openai.com',
    models: [
      {
        name: 'GPT-4.1 Mini',
        slug: 'gpt-4-1-mini',
        inputPricePerMillion: 15.0,
        outputPricePerMillion: 60.0,
        contextWindow: 128000
      },
      {
        name: 'GPT-4o',
        slug: 'gpt-4o',
        inputPricePerMillion: 30.0,
        outputPricePerMillion: 60.0,
        contextWindow: 200000
      }
    ]
  },
  {
    name: 'Mistral',
    slug: 'mistral',
    website: 'https://mistral.ai',
    models: [
      {
        name: 'Mistral Large 2',
        slug: 'mistral-large-2',
        inputPricePerMillion: 12.0,
        outputPricePerMillion: 36.0,
        contextWindow: 128000
      },
      {
        name: 'Mistral Small',
        slug: 'mistral-small',
        inputPricePerMillion: 2.0,
        outputPricePerMillion: 6.0,
        contextWindow: 32000
      }
    ]
  },
  {
    name: 'Anthropic',
    slug: 'anthropic',
    website: 'https://anthropic.com',
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        slug: 'claude-3-5-sonnet',
        inputPricePerMillion: 18.0,
        outputPricePerMillion: 72.0,
        contextWindow: 200000
      },
      {
        name: 'Claude 3.5 Haiku',
        slug: 'claude-3-5-haiku',
        inputPricePerMillion: 3.0,
        outputPricePerMillion: 15.0,
        contextWindow: 200000
      }
    ]
  }
];

async function main() {
  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: {
        name: provider.name,
        website: provider.website,
        models: {
          deleteMany: {},
          create: provider.models.map((model) => ({
            name: model.name,
            slug: model.slug,
            inputPricePerMillion: model.inputPricePerMillion,
            outputPricePerMillion: model.outputPricePerMillion,
            contextWindow: model.contextWindow
          }))
        }
      },
      create: {
        name: provider.name,
        slug: provider.slug,
        website: provider.website,
        models: {
          create: provider.models.map((model) => ({
            name: model.name,
            slug: model.slug,
            inputPricePerMillion: model.inputPricePerMillion,
            outputPricePerMillion: model.outputPricePerMillion,
            contextWindow: model.contextWindow
          }))
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Failed to seed database', error);
    await prisma.$disconnect();
    process.exit(1);
  });
