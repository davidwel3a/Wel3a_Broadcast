import { BroadcastProgress, MessagePayload } from '@/types';
import { sendDirectMessage } from '../discord/bot';

export interface ActiveCampaignJob {
  campaignId: string;
  userId: string;
  botToken: string;
  recipients: Array<{ id: string; username: string }>;
  message: MessagePayload;
  progress: BroadcastProgress;
  isPaused: boolean;
  isStopped: boolean;
}

// Global in-memory campaign jobs map
export const activeCampaigns = new Map<string, ActiveCampaignJob>();

/**
 * Starts processing a campaign delivery queue.
 */
export async function runCampaignQueue(
  job: ActiveCampaignJob,
  onProgress?: (p: BroadcastProgress) => void,
  onError?: (err: { code: string; message: string; title: string }) => void
) {
  activeCampaigns.set(job.campaignId, job);

  for (let i = 0; i < job.recipients.length; i++) {
    // 1. Check if stopped
    if (job.isStopped) break;

    // 2. Check if paused - wait until resumed
    while (job.isPaused && !job.isStopped) {
      await new Promise((r) => setTimeout(r, 500));
    }
    if (job.isStopped) break;

    const recipient = job.recipients[i];
    job.progress.currentUser = { username: recipient.username };

    // 3. Dispatch DM
    const result = await sendDirectMessage(job.botToken, recipient.id, job.message);

    if (result.success) {
      job.progress.sent += 1;
    } else {
      job.progress.failed += 1;
      if (result.error === 'dm_closed') {
        job.progress.failReasons.dmClosed += 1;
      } else if (result.error === 'forbidden') {
        // Trigger emergency anti-ban stop
        job.isStopped = true;
        if (onError) {
          onError({
            code: 'TOKEN_RESTRICTED',
            title: '🚨 تنبيه أمني عاجل: تم تقييد البوت من دسكورد!',
            message: 'تم إيقاف الإرسال فوراً لحماية باقة البروكسي وتفادي إرسال المزيد من الطلبات المرفوضة.',
          });
        }
        break;
      } else {
        job.progress.failReasons.unknown += 1;
      }
    }

    job.progress.remaining = job.recipients.length - (job.progress.sent + job.progress.failed);
    job.progress.percentage = Math.round(((job.progress.sent + job.progress.failed) / job.recipients.length) * 100);

    if (onProgress) {
      onProgress({ ...job.progress });
    }

    // 4. Rate-limiting delay (1.25 seconds between DMs)
    await new Promise((r) => setTimeout(r, 1250));
  }

  activeCampaigns.delete(job.campaignId);
}
