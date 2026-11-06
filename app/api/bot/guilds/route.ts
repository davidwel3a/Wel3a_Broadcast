import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { getActiveBotToken, getBotGuilds } from '@/lib/discord/bot';

export async function GET() {
  try {
    const user = await requireAuthUser();
    const token = getActiveBotToken(user.id);
    if (!token) {
      return NextResponse.json([]);
    }

    try {
      const liveGuilds = await getBotGuilds(token);
      return NextResponse.json(liveGuilds || []);
    } catch (e: unknown) {
      const err = e as Error;
      console.warn('Failed to fetch live guilds from Discord:', err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
