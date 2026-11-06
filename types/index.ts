export type Language = 'ar' | 'en';

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  hasAccessRole: boolean;
}

export interface BotInfo {
  id: string;
  username: string;
  avatar: string;
  discriminator?: string;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: string;
  memberCount: number;
}

export interface DiscordGuild {
  id: string;
  name: string;
  memberCount: number;
  icon?: string;
  roles: DiscordRole[];
}

export interface EmbedData {
  title: string;
  description: string;
  color: string;
  image?: string;
}

export interface MessagePayload {
  content: string | null;
  embed: EmbedData | null;
  imageUrl: string | null;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string | null;
  embed: EmbedData | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface BroadcastProgress {
  percentage: number;
  sent: number;
  failed: number;
  remaining: number;
  estTimeLeft: string;
  isPaused: boolean;
  currentUser?: {
    username: string;
    avatar?: string;
  };
  failReasons: {
    dmClosed: number;
    leftServer: number;
    unknown: number;
  };
}

export interface ScheduledCampaign {
  id: string;
  guildId: string;
  guildName: string;
  targetDescription: string;
  scheduledAt: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message: MessagePayload;
}

export interface CampaignLog {
  id: string;
  createdAt: string;
  guildName: string;
  messagePreview: string;
  total: number;
  sent: number;
  failed: number;
  ratio: string;
}

export interface GlobalStats {
  totalSent: number;
  totalFailed: number;
  totalOperations: number;
  totalBots: number;
  successRatio: string;
}
