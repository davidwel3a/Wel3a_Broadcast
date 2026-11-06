import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { mockScheduledCampaigns } from '@/lib/mock-data';

const scheduleSchema = z.object({
  guildId: z.string(),
  roleIds: z.array(z.string()).default([]),
  sendToAll: z.boolean().default(false),
  scheduledAt: z.string(),
  message: z.object({
    content: z.string().nullable().optional(),
    embed: z.any().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
  }),
});

export async function GET() {
  try {
    await requireAuthUser();
    return NextResponse.json(mockScheduledCampaigns);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthUser();
    const body = await req.json();
    const payload = scheduleSchema.parse(body);

    const newCampaign = {
      id: `sched_${Date.now()}`,
      guild_id: payload.guildId,
      target: payload.sendToAll ? 'All Members' : `${payload.roleIds.length} Roles`,
      status: 'pending',
      scheduled_at: payload.scheduledAt,
    };

    return NextResponse.json({
      success: true,
      campaign: newCampaign,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
