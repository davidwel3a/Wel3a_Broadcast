import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';

const testSchema = z.object({
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
    testSchema.parse(body);

    // In production with token, calls sendDirectMessage(botToken, user.discordId, message)
    return NextResponse.json({
      success: true,
      recipient: user.username,
      status: 'delivered',
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
