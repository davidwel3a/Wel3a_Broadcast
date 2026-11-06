import { DiscordGuild, MessageTemplate, CampaignLog, GlobalStats, ScheduledCampaign } from '../types';

export const mockGuilds: DiscordGuild[] = [
  {
    id: 'guild_001',
    name: 'سيرفر مجتمع البودكاست العربي',
    memberCount: 1420,
    roles: [
      { id: 'role_vip', name: 'VIP Members', color: '#f59e0b', memberCount: 120 },
      { id: 'role_active', name: 'المتفاعلين', color: '#8b5cf6', memberCount: 450 },
      { id: 'role_verified', name: 'الأعضاء الموثقين', color: '#3b82f6', memberCount: 980 },
      { id: 'role_new', name: 'أعضاء جدد', color: '#10b981', memberCount: 350 },
    ],
  },
  {
    id: 'guild_002',
    name: 'متجر الخدمات الرقمية',
    memberCount: 3200,
    roles: [
      { id: 'role_clients', name: 'العملاء الدائمين', color: '#ec4899', memberCount: 380 },
      { id: 'role_traders', name: 'التجار المعتمدين', color: '#eab308', memberCount: 85 },
      { id: 'role_subscribers', name: 'المشتركين', color: '#6366f1', memberCount: 2200 },
    ],
  },
];

export const mockTemplates: MessageTemplate[] = [
  {
    id: 'tpl_1',
    name: 'إعلان مسابقة أسبوعية',
    content: '🎉 مرحباً بكم جميعاً! تم إطلاق المسابقة الأسبوعية الكبرى في سيرفرنا.',
    embed: {
      title: '🏆 مسابقة أفضل منشئ محتوى',
      description: 'جوائز كبرى تنتظركم! انضم الآن إلى قناة الفعاليات وشارك بصوتك.',
      color: '#7c3aed',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    },
    imageUrl: null,
    createdAt: '2026-11-01T12:00:00Z',
  },
  {
    id: 'tpl_2',
    name: 'تحديث صيانة البوت',
    content: '⚠️ تنبيه هام: سيتم إجراء صيانة مجدولة لسيرفراتنا لمدة 30 دقيقة.',
    embed: {
      title: '🛠️ إشعار صيانة دورية',
      description: 'نعمل على تحسين جودة بث الرسائل وتسريع الاستجابة. شكراً لتفهمكم.',
      color: '#f59e0b',
      image: undefined,
    },
    imageUrl: null,
    createdAt: '2026-11-04T09:30:00Z',
  },
];

export const mockScheduledCampaigns: ScheduledCampaign[] = [
  {
    id: 'sched_1',
    guildId: 'guild_001',
    guildName: 'سيرفر مجتمع البودكاست العربي',
    targetDescription: 'VIP Members (120 عضو)',
    scheduledAt: '2026-11-07T18:00:00Z',
    status: 'pending',
    message: {
      content: 'تذكير: البث المباشر سيبدأ غداً في تمام الساعة 8 مساءً بتوقيت مكة!',
      embed: null,
      imageUrl: null,
    },
  },
];

export const mockLogs: CampaignLog[] = [
  {
    id: 'log_1',
    createdAt: '2026-11-05T14:22:00Z',
    guildName: 'سيرفر مجتمع البودكاست العربي',
    messagePreview: '🏆 مسابقة أفضل منشئ محتوى...',
    total: 450,
    sent: 432,
    failed: 18,
    ratio: '96%',
  },
  {
    id: 'log_2',
    createdAt: '2026-11-02T19:15:00Z',
    guildName: 'متجر الخدمات الرقمية',
    messagePreview: 'عروض حصرية لنهاية الأسبوع...',
    total: 380,
    sent: 374,
    failed: 6,
    ratio: '98%',
  },
  {
    id: 'log_3',
    createdAt: '2026-10-28T11:00:00Z',
    guildName: 'سيرفر مجتمع البودكاست العربي',
    messagePreview: 'تحديث هام بخصوص رتب الأعضاء...',
    total: 120,
    sent: 119,
    failed: 1,
    ratio: '99%',
  },
];

export const mockStats: GlobalStats = {
  totalSent: 12840,
  totalFailed: 412,
  totalOperations: 48,
  totalBots: 14,
  successRatio: '97%',
};
