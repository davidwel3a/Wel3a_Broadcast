import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { botCredentials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getActiveBotToken, validateAndConnectBot } from '@/lib/discord/bot';

export async function GET() {
  try {
    const user = await requireAuthUser();

    // 1. Check in-memory active session token
    const token = getActiveBotToken(user.id);
    if (token) {
      try {
        const bot = await validateAndConnectBot(token);
        return NextResponse.json({
          connected: true,
          bot,
        });
      } catch {
        // token expired or invalid
      }
    }

    // 2. Check DB if configured
    if (db) {
      const result = await db
        .select()
        .from(botCredentials)
        .where(eq(botCredentials.userId, user.id))
        .limit(1);

      if (result.length > 0 && result[0].isConnected) {
        return NextResponse.json({
          connected: true,
          bot: {
            id: result[0].botId,
            username: result[0].botUsername,
            avatar: result[0].botAvatarUrl,
          },
        });
      }
    }

    return NextResponse.json({
      connected: false,
      bot: null,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ connected: false, message: error.message }, { status: 400 });
  }
}
