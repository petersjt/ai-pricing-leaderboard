import { NextResponse } from 'next/server';
import { getLeaderboardModels } from '@ai-pricing-leaderboard/db';

export async function GET() {
  const models = await getLeaderboardModels();

  return NextResponse.json({ data: models });
}
