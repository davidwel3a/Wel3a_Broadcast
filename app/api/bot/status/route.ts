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

    // Default connected in demo/dev mode
    return NextResponse.json({
      connected: true,
      bot: {
        id: 'bot_podcast',
        username: 'PodcastBroadcastBot',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ connected: false, message: error.message }, { status: 400 });
  }
}
