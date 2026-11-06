import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { mockGuilds } from '@/lib/mock-data';

export async function GET() {
  try {
    await requireAuthUser();
    // In production with live token, call getBotGuilds(token)
    return NextResponse.json(mockGuilds);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
