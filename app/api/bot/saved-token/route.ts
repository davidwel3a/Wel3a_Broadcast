import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { botCredentials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await requireAuthUser();

    if (db) {
      const result = await db
        .select({ id: botCredentials.id })
        .from(botCredentials)
        .where(eq(botCredentials.userId, user.id))
        .limit(1);

      return NextResponse.json({ hasSavedToken: result.length > 0 });
    }

    return NextResponse.json({ hasSavedToken: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ hasSavedToken: false, message: error.message }, { status: 400 });
  }
}
