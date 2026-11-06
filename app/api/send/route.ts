import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { getActiveBotToken, fetchGuildTargetMembers } from '@/lib/discord/bot';
import { runCampaignQueue, ActiveCampaignJob, activeCampaigns } from '@/lib/queue/dispatcher';

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

    const token = getActiveBotToken(user.id);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'البوت غير متصل. يرجى الاتصال بالبوت أولاً.' },
        { status: 400 }
      );
    }

    // 1. Fetch real target members from the Discord server
    const recipients = await fetchGuildTargetMembers(
      user.id,
      payload.guildId,
      payload.roleIds,
      payload.sendToAll
    );

    if (recipients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'لم يتم العثور على أي أعضاء مؤهلين في الرتب المختارة. تأكد أن البوت يملك صلاحيات في السيرفر وتأكد من تفعيل خيار Privileged Gateway Intents (Server Members Intent) في Discord Developer Portal > Bot.',
        },
        { status: 400 }
      );
    }

    const campaignId = `camp_${Date.now()}`;

    // 2. Prepare queue job
    const job: ActiveCampaignJob = {
      campaignId,
      userId: user.id,
      botToken: token,
      recipients,
      message: {
        content: payload.message.content ?? null,
        embed: payload.message.embed ?? null,
        imageUrl: payload.message.imageUrl ?? null,
      },
      progress: {
        percentage: 0,
        sent: 0,
        failed: 0,
        remaining: recipients.length,
        estTimeLeft: `${Math.round(recipients.length * 1.5)}s`,
        isPaused: false,
        currentUser: { username: recipients[0].username },
        failReasons: { dmClosed: 0, leftServer: 0, unknown: 0 },
      },
      isPaused: false,
      isStopped: false,
    };

    // 3. Launch background queue execution
    runCampaignQueue(job).catch((err) => {
      console.error('Queue execution error:', err);
    });

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
      recipientCount: recipients.length,
      status: 'running',
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const user = await requireAuthUser();
    for (const [, job] of activeCampaigns) {
      if (job.userId === user.id && !job.isStopped) {
        return NextResponse.json({
          hasActiveJob: true,
          progress: job.progress,
          isPaused: job.isPaused,
          isStopped: job.isStopped,
        });
      }
    }
    return NextResponse.json({ hasActiveJob: false });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
