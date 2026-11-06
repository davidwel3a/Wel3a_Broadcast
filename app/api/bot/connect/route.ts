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
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');

    // 1. Validate token with Discord REST API
    const botInfo = await validateAndConnectBot(cleanToken);
    setActiveBotToken(user.id, cleanToken);

    // 2. Encrypt token using AES-256-GCM
    const { encrypted, iv, tag } = encryptToken(cleanToken);

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
    const error = err as { message?: string; status?: number; code?: number };
    let msg = error.message || 'Failed to connect bot';
    if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.includes('token')) {
      msg = 'توكن البوت غير صحيح أو تم إعادة تعيينه (Invalid Bot Token). تأكد من نسخه من Discord Developer Portal > Bot > Reset Token.';
    }
    return NextResponse.json(
      { success: false, message: msg },
      { status: 400 }
    );
  }
}
