import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { botCredentials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const user = await requireAuthUser();

    if (db) {
      await db
        .update(botCredentials)
        .set({ isConnected: false, updatedAt: new Date() })
        .where(eq(botCredentials.userId, user.id));
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
