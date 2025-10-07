import { PrismaClient } from '@prisma/client';
import {
  leaderboardModelSchema,
  providerSummarySchema,
  type LeaderboardModel,
  type ProviderSummary
} from '@ai-pricing-leaderboard/types';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function getLeaderboardModels(): Promise<LeaderboardModel[]> {
  const models = await prisma.model.findMany({
    include: { provider: true },
    orderBy: {
      inputPricePerMillion: 'asc'
    }
  });

  return models.map((model) =>
    leaderboardModelSchema.parse({
      id: model.id,
      provider: model.provider.name,
      model: model.name,
      inputPrice: Number(model.inputPricePerMillion),
      outputPrice: Number(model.outputPricePerMillion)
    })
  );
}

export async function getLeaderboardModelById(id: string): Promise<LeaderboardModel | null> {
  const model = await prisma.model.findUnique({
    where: { id },
    include: { provider: true }
  });

  if (!model) {
    return null;
  }

  return leaderboardModelSchema.parse({
    id: model.id,
    provider: model.provider.name,
    model: model.name,
    inputPrice: Number(model.inputPricePerMillion),
    outputPrice: Number(model.outputPricePerMillion)
  });
}

export async function getProviders(): Promise<ProviderSummary[]> {
  const providers = await prisma.provider.findMany({
    include: {
      _count: { select: { models: true } }
    }
  });

  return providers.map((provider) =>
    providerSummarySchema.parse({
      id: provider.id,
      name: provider.name,
      models: provider._count.models,
      website: provider.website ?? undefined
    })
  );
}
