import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalSent: 0,
    totalFailed: 0,
    successRatio: '100%',
    activeGuilds: 0,
  });
}
