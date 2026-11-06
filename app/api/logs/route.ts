import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { mockLogs } from '@/lib/mock-data';

export async function GET() {
  try {
    await requireAuthUser();
    return NextResponse.json(mockLogs);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
