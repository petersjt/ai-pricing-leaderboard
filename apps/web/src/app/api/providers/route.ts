import { NextResponse } from 'next/server';
import { getProviders } from '@ai-pricing-leaderboard/db';

export async function GET() {
  const providers = await getProviders();
  return NextResponse.json({ data: providers });
}
