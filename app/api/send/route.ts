import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';

const sendSchema = z.object({
  guildId: z.string(),
  roleIds: z.array(z.string()).default([]),
  sendToAll: z.boolean().default(false),
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
    const payload = sendSchema.parse(body);

    const campaignId = `camp_${Date.now()}`;

    if (db) {
      await db.insert(campaigns).values({
        userId: user.id,
        guildId: payload.guildId,
        guildName: 'Selected Guild',
        targetType: payload.sendToAll ? 'all' : 'roles',
        targetRoleIds: payload.roleIds,
        messageContent: payload.message.content || null,
        embedData: payload.message.embed || null,
        imageUrl: payload.message.imageUrl || null,
        status: 'running',
        startedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      campaignId,
      status: 'running',
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
