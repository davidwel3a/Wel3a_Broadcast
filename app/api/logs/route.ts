import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuthUser();
    return NextResponse.json([]);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
