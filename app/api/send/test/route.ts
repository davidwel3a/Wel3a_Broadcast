import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { getActiveBotToken, sendDirectMessage } from '@/lib/discord/bot';

const testSchema = z.object({
  targetUserId: z.string().optional(),
  message: z.object({
    content: z.string().nullable().optional(),
    embed: z.any().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();
    const { targetUserId, message } = testSchema.parse(body);

    const token = getActiveBotToken(user.id);
    if (token && targetUserId) {
      const result = await sendDirectMessage(token, targetUserId, {
        content: message.content ?? null,
        embed: message.embed ?? null,
        imageUrl: message.imageUrl ?? null,
      });
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: `Discord DM failed: ${result.error}` },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        recipient: targetUserId,
        status: 'delivered',
        isLive: true,
      });
    }

    return NextResponse.json({
      success: true,
      recipient: user.username,
      status: 'delivered',
      isLive: false,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
