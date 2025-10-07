import { NextResponse } from 'next/server';
import { getLeaderboardModelById } from '@ai-pricing-leaderboard/db';
import { paramsSchema } from '@ai-pricing-leaderboard/types';

export async function GET(_request: Request, context: { params: unknown }) {
  const parseResult = paramsSchema.safeParse(context.params);

  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid model id' }, { status: 400 });
  }

  const model = await getLeaderboardModelById(parseResult.data.id);

  if (!model) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  return NextResponse.json({ data: model });
}
