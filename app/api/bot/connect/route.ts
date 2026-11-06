import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { validateAndConnectBot, setActiveBotToken } from '@/lib/discord/bot';
import { encryptToken } from '@/lib/crypto';
import { db } from '@/lib/db';
import { botCredentials } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const connectSchema = z.object({
  token: z.string().min(10, 'Invalid Discord Bot Token'),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();
    const { token } = connectSchema.parse(body);

    // 1. Validate token with Discord REST API
    const botInfo = await validateAndConnectBot(token);
    setActiveBotToken(user.id, token);

    // 2. Encrypt token using AES-256-GCM
    const { encrypted, iv, tag } = encryptToken(token);

    // 3. Upsert into database if configured
    if (db) {
      await db
        .insert(botCredentials)
        .values({
          userId: user.id,
          encryptedToken: encrypted,
          tokenIv: iv,
          tokenTag: tag,
          botId: botInfo.id,
          botUsername: botInfo.username,
          botAvatarUrl: botInfo.avatar,
          isConnected: true,
          lastConnectedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: botCredentials.userId,
          set: {
            encryptedToken: encrypted,
            tokenIv: iv,
            tokenTag: tag,
            botId: botInfo.id,
            botUsername: botInfo.username,
            botAvatarUrl: botInfo.avatar,
            isConnected: true,
            lastConnectedAt: new Date(),
            updatedAt: new Date(),
          },
        });
    }

    return NextResponse.json({
      success: true,
      bot: botInfo,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to connect bot' },
      { status: 400 }
    );
  }
}
