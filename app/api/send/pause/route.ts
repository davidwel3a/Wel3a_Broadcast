import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';

export async function POST() {
  try {
    await requireAuthUser();
    return NextResponse.json({ success: true, isPaused: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
