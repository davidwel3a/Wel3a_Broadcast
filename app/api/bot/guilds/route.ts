import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { mockGuilds } from '@/lib/mock-data';
import { getActiveBotToken, getBotGuilds } from '@/lib/discord/bot';

export async function GET() {
  try {
    const user = await requireAuthUser();
    const token = getActiveBotToken(user.id);
    if (token) {
      try {
        const liveGuilds = await getBotGuilds(token);
        if (liveGuilds && liveGuilds.length > 0) {
          return NextResponse.json(liveGuilds);
        }
      } catch (e) {
        console.warn('Failed to fetch live guilds, falling back to mock:', e);
      }
    }
    return NextResponse.json(mockGuilds);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
