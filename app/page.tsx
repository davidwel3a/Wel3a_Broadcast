'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  Users,
  Clock,
  FileText,
  Eye,
  BookmarkPlus,
  Play,
  Pause,
  Square,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  TrendingUp,
  Globe,
  Trash2,
  Calendar,
} from 'lucide-react';
import { translations } from '../lib/i18n';
import {
  mockGuilds,
  mockTemplates,
  mockLogs,
  mockStats,
  mockScheduledCampaigns,
} from '../lib/mock-data';
import {
  Language,
  UserProfile,
  BotInfo,
  MessagePayload,
  MessageTemplate,
  BroadcastProgress,
  ScheduledCampaign,
} from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RoleChip } from '../components/ui/RoleChip';
import { DiscordPreviewModal } from '../components/ui/DiscordPreviewModal';
import { EmergencyModal } from '../components/ui/EmergencyModal';
import { StatCard } from '../components/ui/StatCard';
import { ToastContainer, ToastItem } from '../components/ui/Toast';

export default function DashboardPage() {
  // Localization State
  const [lang, setLang] = useState<Language>('ar');
  const t = translations[lang];

  // Auth State (S01)
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user_123',
    username: 'DavidDev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    hasAccessRole: true,
  });

  // Bot Connection State (S02)
  const [botToken, setBotToken] = useState('••••••••••••••••••••••••••••••••');
  const [botConnected, setBotConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [botInfo, setBotInfo] = useState<BotInfo | null>({
    id: 'bot_98765',
    username: 'PodcastBroadcastBot',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    discriminator: '0001',
  });
  const [showSetupHelp, setShowSetupHelp] = useState(false);

  // Audience State (S03)
  const [selectedGuildId, setSelectedGuildId] = useState(mockGuilds[0].id);
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(['role_vip']);

  // Message Composer State (S04)
  const [activeTab, setActiveTab] = useState<'text' | 'embed' | 'image'>('text');
  const [textContent, setTextContent] = useState('مرحباً بكم! يسرنا دعوتكم لحضور حلقة البودكاست الجديدة اليوم في تمام الساعة 9:00 م.');
  const [embedTitle, setEmbedTitle] = useState('🎙️ حلقة جديدة: مستقبل الذكاء الاصطناعي');
  const [embedDesc, setEmbedDesc] = useState('استمع الآن إلى أحدث النقاشات مع كبار الخبراء وتعرف على آخر التطورات.');
  const [embedColor, setEmbedColor] = useState('#7c3aed');
  const [embedImage, setEmbedImage] = useState('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop&q=80');
  const [imageUrl, setImageUrl] = useState('');

  // Modals & Drawers (S05, S06, S09)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockTemplates);
  const [templateNameInput, setTemplateNameInput] = useState('');
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);

  // Scheduling & Execution (S07, S08, S11)
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleCustomHours, setScheduleCustomHours] = useState('2');
  const [scheduledList, setScheduledList] = useState<ScheduledCampaign[]>(mockScheduledCampaigns);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState<BroadcastProgress>({
    percentage: 0,
    sent: 0,
    failed: 0,
    remaining: 120,
    estTimeLeft: '2m 15s',
    isPaused: false,
    currentUser: { username: 'Ahmad_99' },
    failReasons: { dmClosed: 0, leftServer: 0, unknown: 0 },
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastItem['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Helper calculations for Audience
  const currentGuild = mockGuilds.find((g) => g.id === selectedGuildId) || mockGuilds[0];
  const targetRecipientCount = sendToAll
    ? currentGuild.memberCount
    : currentGuild.roles
        .filter((r) => selectedRoleIds.includes(r.id))
        .reduce((acc, curr) => acc + curr.memberCount, 0);

  const estimatedSeconds = Math.round(targetRecipientCount * 1.2);
  const formatETA = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remainSec = sec % 60;
    return `${mins}m ${remainSec}s`;
  };

  const getMessagePayload = (): MessagePayload => ({
    content: textContent.trim() || null,
    embed: activeTab === 'embed' ? {
      title: embedTitle.trim(),
      description: embedDesc.trim(),
      color: embedColor,
      image: embedImage.trim() || undefined,
    } : null,
    imageUrl: activeTab === 'image' && imageUrl.trim() ? imageUrl.trim() : null,
  });

  // Simulated Broadcast Runner (S08)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSending && !progress.isPaused && progress.percentage < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const nextSent = prev.sent + 1;
          const nextPerc = Math.min(100, Math.round((nextSent / (targetRecipientCount || 10)) * 100));
          const nextRemaining = Math.max(0, targetRecipientCount - nextSent);

          if (nextPerc >= 100) {
            setIsSending(false);
            addToast(lang === 'ar' ? '🎉 اكتملت حملة البث بنجاح!' : '🎉 Broadcast campaign completed successfully!', 'success');
          }

          return {
            ...prev,
            sent: nextSent,
            percentage: nextPerc,
            remaining: nextRemaining,
            estTimeLeft: formatETA(nextRemaining),
            currentUser: { username: `Member_${nextSent + 10}` },
          };
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isSending, progress.isPaused, progress.percentage, targetRecipientCount, lang]);

  // Handlers
  const handleToggleRole = (id: string) => {
    if (sendToAll) setSendToAll(false);
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleConnectBot = () => {
    if (!botToken.trim()) {
      addToast(lang === 'ar' ? 'يرجى إدخال توكن البوت أولاً' : 'Please enter bot token', 'warning');
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setBotConnected(true);
      setBotInfo({
        id: 'bot_custom',
        username: 'PodcastBroadcastBot',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        discriminator: '0001',
      });
      addToast(lang === 'ar' ? 'تم الاتصال بالبوت بنجاح' : 'Bot connected successfully', 'success');
    }, 800);
  };

  const handleDisconnectBot = () => {
    setBotConnected(false);
    setBotInfo(null);
    addToast(lang === 'ar' ? 'تم قطع الاتصال بالبوت' : 'Bot disconnected', 'info');
  };

  const handleSaveTemplate = () => {
    if (!templateNameInput.trim()) return;
    const newTpl: MessageTemplate = {
      id: `tpl_${Date.now()}`,
      name: templateNameInput.trim(),
      content: textContent,
      embed: activeTab === 'embed' ? {
        title: embedTitle,
        description: embedDesc,
        color: embedColor,
        image: embedImage || undefined,
      } : null,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
    };
    setTemplates([newTpl, ...templates]);
    setTemplateNameInput('');
    setShowSaveTemplateDialog(false);
    addToast(lang === 'ar' ? 'تم حفظ القالب بنجاح' : 'Template saved', 'success');
  };

  const handleApplyTemplate = (tpl: MessageTemplate) => {
    if (tpl.content) setTextContent(tpl.content);
    if (tpl.embed) {
      setActiveTab('embed');
      setEmbedTitle(tpl.embed.title);
      setEmbedDesc(tpl.embed.description);
      setEmbedColor(tpl.embed.color);
      if (tpl.embed.image) setEmbedImage(tpl.embed.image);
    } else {
      setActiveTab('text');
    }
    addToast(lang === 'ar' ? `تم تطبيق قالب: ${tpl.name}` : `Applied template: ${tpl.name}`, 'info');
  };

  const handleStartBroadcast = () => {
    if (targetRecipientCount === 0) {
      addToast(lang === 'ar' ? 'يرجى اختيار رتبة أو تحديد الإرسال للجميع' : 'Please choose target roles', 'warning');
      return;
    }

    if (scheduleEnabled) {
      const scheduledAt = new Date(Date.now() + parseInt(scheduleCustomHours || '1', 10) * 3600000).toISOString();
      const newSched: ScheduledCampaign = {
        id: `sched_${Date.now()}`,
        guildId: currentGuild.id,
        guildName: currentGuild.name,
        targetDescription: sendToAll ? 'All Members' : `${selectedRoleIds.length} Roles (${targetRecipientCount} members)`,
        scheduledAt,
        status: 'pending',
        message: getMessagePayload(),
      };
      setScheduledList([newSched, ...scheduledList]);
      setScheduleEnabled(false);
      addToast(lang === 'ar' ? 'تم جدولة الحملة بنجاح!' : 'Campaign scheduled successfully!', 'success');
      return;
    }

    // Immediate start
    setProgress({
      percentage: 0,
      sent: 0,
      failed: 0,
      remaining: targetRecipientCount,
      estTimeLeft: formatETA(estimatedSeconds),
      isPaused: false,
      currentUser: { username: 'Member_1' },
      failReasons: { dmClosed: 0, leftServer: 0, unknown: 0 },
    });
    setIsSending(true);
    addToast(lang === 'ar' ? 'بدأ إرسال حملة البرودكاست...' : 'Broadcast started...', 'info');
  };

  const handleTestSend = () => {
    addToast(lang === 'ar' ? 'تم إرسال الرسالة التجريبية إلى حسابك في دسكورد!' : 'Test message sent to your Discord DM!', 'success');
  };

  // If unauthenticated (S01)
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-bg">
        <div className="card-glass max-w-md w-full p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-discord to-indigo-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-discord/30">
            <Radio size={32} />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">{t.loginTitle}</h2>
          <p className="text-sm text-text-muted leading-relaxed mb-6">{t.loginDesc}</p>
          <Button
            variant="discord"
            size="lg"
            fullWidth
            onClick={() => setUser({
              id: 'user_david',
              username: 'DavidDev',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              hasAccessRole: true,
            })}
          >
            {t.loginButton}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className={`min-h-screen bg-bg text-text pb-16 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-border/80 bg-surface/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center text-white shadow-md">
              <Radio size={20} />
            </div>
            <h1 className="font-bold text-lg text-text tracking-tight">{t.appTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface border border-border text-text hover:border-accent transition-colors"
            >
              <Globe size={14} className="text-accent" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 px-3 py-1 bg-surface/50 border border-border rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-medium text-text">{user.username}</span>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setUser(null)}>
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Builder & Controls) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* S02: Bot Connection Card */}
          <section className="card-glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${botConnected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                <h3 className="font-bold text-sm text-text">{t.connectBotTitle}</h3>
              </div>
              {botConnected && botInfo && (
                <div className="flex items-center gap-2 text-xs font-medium text-text-muted bg-surface/80 px-2.5 py-1 rounded-md border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={botInfo.avatar} alt="Bot Avatar" className="w-4 h-4 rounded-full" />
                  <span>{botInfo.username}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  isPassword
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder={t.tokenPlaceholder}
                  disabled={botConnected}
                />
              </div>
              {botConnected ? (
                <Button variant="ghost" onClick={handleDisconnectBot}>
                  {t.disconnectBtn}
                </Button>
              ) : (
                <Button variant="primary" loading={isConnecting} onClick={handleConnectBot}>
                  {t.connectBtn}
                </Button>
              )}
            </div>

            {/* Bot Developer Setup Guide Accordion */}
            <div className="mt-3.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowSetupHelp(!showSetupHelp)}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent font-medium transition-colors"
              >
                <HelpCircle size={14} />
                <span>{t.helpTitle}</span>
              </button>
              {showSetupHelp && (
                <div className="mt-2.5 p-3.5 bg-black/20 rounded-lg text-xs text-text-muted leading-relaxed space-y-2 border border-white/5">
                  <p>1. اذهب إلى بوابة مطوري دسكورد (Discord Developer Portal) وأنشئ تطبيقاً جديداً.</p>
                  <p className="text-warning font-medium">2. مهم جداً: فعّل خيارات Privileged Gateway Intents (Server Members Intent و Message Content Intent).</p>
                  <p>3. انسخ التوكن من صفحة Bot وضعه بالأعلى للاتصال المباشر.</p>
                </div>
              )}
            </div>
          </section>

          {/* S03: Target Audience Settings Card */}
          <section className="card-glass p-5">
            <h3 className="font-bold text-sm text-text mb-4 flex items-center gap-2">
              <Users size={16} className="text-accent" />
              <span>{t.targetSettingsTitle}</span>
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">
                  {t.targetServerLabel}
                </label>
                <select
                  value={selectedGuildId}
                  onChange={(e) => setSelectedGuildId(e.target.value)}
                  className="w-full h-10 px-3 bg-surface/80 border border-border rounded-md text-sm text-text focus:outline-none focus:border-accent"
                >
                  {mockGuilds.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.memberCount} {t.membersUnit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Roles Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-text-muted">
                    {t.selectRolesLabel}
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-text cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendToAll}
                      onChange={(e) => {
                        setSendToAll(e.target.checked);
                        if (e.target.checked) setSelectedRoleIds([]);
                      }}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    <span>{t.sendToAllLabel}</span>
                  </label>
                </div>

                {!sendToAll && (
                  <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-lg border border-white/5 min-h-[50px] items-center">
                    {currentGuild.roles.map((role) => (
                      <RoleChip
                        key={role.id}
                        id={role.id}
                        name={role.name}
                        color={role.color}
                        memberCount={role.memberCount}
                        selected={selectedRoleIds.includes(role.id)}
                        onToggle={handleToggleRole}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Estimated Target & Duration Badges */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-md text-xs font-medium text-accent">
                  <Users size={14} />
                  <span>{t.targetCountLabel} <strong>{targetRecipientCount}</strong> {t.membersUnit}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-md text-xs font-medium text-text-muted">
                  <Clock size={14} />
                  <span>{t.estimatedTimeLabel} <strong>{formatETA(estimatedSeconds)}</strong></span>
                </div>
              </div>
            </div>
          </section>

          {/* S04: Broadcast Message Composer Card */}
          <section className="card-glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <FileText size={16} className="text-accent" />
                <span>{t.editorTitle}</span>
              </h3>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Eye size={14} />} onClick={() => setIsPreviewOpen(true)}>
                  {t.previewBtn}
                </Button>
                <Button variant="ghost" size="sm" icon={<BookmarkPlus size={14} />} onClick={() => setShowSaveTemplateDialog(true)}>
                  {t.saveTemplateBtn}
                </Button>
              </div>
            </div>

            {/* Template Save Dialog */}
            {showSaveTemplateDialog && (
              <div className="mb-4 p-3 bg-surface/90 border border-accent/40 rounded-lg flex items-center gap-2">
                <Input
                  placeholder={t.saveTemplatePrompt}
                  value={templateNameInput}
                  onChange={(e) => setTemplateNameInput(e.target.value)}
                />
                <Button variant="primary" size="sm" onClick={handleSaveTemplate}>
                  {t.saveBtn}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSaveTemplateDialog(false)}>
                  {t.cancelBtn}
                </Button>
              </div>
            )}

            {/* Editor Mode Tabs */}
            <div className="flex border-b border-border/80 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === 'text'
                    ? 'border-accent text-text'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {t.tabText}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('embed')}
                className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === 'embed'
                    ? 'border-accent text-text'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {t.tabEmbed}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === 'image'
                    ? 'border-accent text-text'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {t.tabImage}
              </button>
            </div>

            {/* Tab 1: Plain Text */}
            {activeTab === 'text' && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={t.textPlaceholder}
                  rows={4}
                  className="w-full p-3 bg-surface/80 border border-border rounded-md text-sm text-text focus:outline-none focus:border-accent resize-y"
                  maxLength={2000}
                />
                <div className="text-right text-xs text-text-muted">
                  {textContent.length} / 2000
                </div>
              </div>
            )}

            {/* Tab 2: Embed */}
            {activeTab === 'embed' && (
              <div className="flex flex-col gap-3">
                <Input
                  label={t.embedTitleLabel}
                  placeholder={t.embedTitlePlaceholder}
                  value={embedTitle}
                  onChange={(e) => setEmbedTitle(e.target.value)}
                  maxLength={256}
                />
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">
                    {t.embedDescLabel}
                  </label>
                  <textarea
                    value={embedDesc}
                    onChange={(e) => setEmbedDesc(e.target.value)}
                    placeholder={t.embedDescPlaceholder}
                    rows={4}
                    className="w-full p-3 bg-surface/80 border border-border rounded-md text-sm text-text focus:outline-none focus:border-accent resize-y"
                    maxLength={4096}
                  />
                  <div className="text-right text-xs text-text-muted">
                    {embedDesc.length} / 4096
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">
                      {t.embedColorLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={embedColor}
                        onChange={(e) => setEmbedColor(e.target.value)}
                        className="w-10 h-10 rounded border border-border bg-transparent cursor-pointer p-0"
                      />
                      <Input value={embedColor} onChange={(e) => setEmbedColor(e.target.value)} />
                    </div>
                  </div>
                  <Input
                    label={t.embedImageLabel}
                    value={embedImage}
                    onChange={(e) => setEmbedImage(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Direct Attachment */}
            {activeTab === 'image' && (
              <div className="flex flex-col gap-3">
                <Input
                  label={t.imageAttachmentLabel}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
                {imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden max-w-sm border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Attachment preview" className="w-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </section>

          {/* S07: Broadcast Execution Controls Card */}
          <section className="card-glass p-5">
            <h3 className="font-bold text-sm text-text mb-4">{t.controlsTitle}</h3>

            <div className="flex flex-col gap-4">
              {/* Schedule Checkbox */}
              <label className="inline-flex items-center gap-2.5 text-xs font-medium text-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  onChange={(e) => setScheduleEnabled(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <Calendar size={14} className="text-accent" />
                <span>{t.scheduleLabel}</span>
              </label>

              {scheduleEnabled && (
                <div className="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-wrap items-center gap-3">
                  <span className="text-xs text-text-muted">{t.schedulePresets}</span>
                  {['1', '6', '12', '24'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setScheduleCustomHours(h)}
                      className={`px-3 py-1 rounded text-xs font-medium border ${
                        scheduleCustomHours === h
                          ? 'bg-accent/20 border-accent text-text'
                          : 'bg-surface border-border text-text-muted hover:text-text'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ltr:ml-auto rtl:mr-auto">
                    <span className="text-xs text-text-muted">+{scheduleCustomHours} hours</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Send size={16} />}
                  onClick={handleStartBroadcast}
                  disabled={isSending}
                >
                  {t.startSendBtn}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleTestSend}
                  disabled={isSending}
                >
                  {t.testSendBtn}
                </Button>
              </div>
            </div>
          </section>

          {/* S08: Real-Time Delivery Monitor */}
          {isSending && (
            <section className="card-glass p-5 border-accent/40 shadow-glow animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <h4 className="font-bold text-sm text-text">
                    {progress.isPaused ? t.progressPaused : t.progressSending}
                  </h4>
                </div>
                <span className="text-sm font-bold text-accent font-mono">
                  {progress.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden mb-4 border border-border/50">
                <div
                  className="h-full bg-gradient-to-r from-accent to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>

              {/* Live Target User Chip */}
              {progress.currentUser && (
                <div className="flex items-center gap-2 text-xs text-text-muted mb-4 bg-black/20 p-2 rounded-md border border-white/5">
                  <span>{t.progressTargetUser}</span>
                  <span className="text-accent font-mono font-bold">@{progress.currentUser.username}</span>
                </div>
              )}

              {/* Real-time counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-surface/50 p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[11px] text-text-muted block">{t.statSent}</span>
                  <span className="text-base font-bold text-success font-mono">{progress.sent}</span>
                </div>
                <div className="bg-surface/50 p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[11px] text-text-muted block">{t.statFailed}</span>
                  <span className="text-base font-bold text-danger font-mono">{progress.failed}</span>
                </div>
                <div className="bg-surface/50 p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[11px] text-text-muted block">{t.statRemaining}</span>
                  <span className="text-base font-bold text-text font-mono">{progress.remaining}</span>
                </div>
                <div className="bg-surface/50 p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[11px] text-text-muted block">{t.statTimeLeft}</span>
                  <span className="text-base font-bold text-text-muted font-mono">{progress.estTimeLeft}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {progress.isPaused ? (
                  <Button
                    variant="success"
                    size="sm"
                    icon={<Play size={14} />}
                    onClick={() => setProgress({ ...progress, isPaused: false })}
                  >
                    {t.resumeBtn}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Pause size={14} />}
                    onClick={() => setProgress({ ...progress, isPaused: true })}
                  >
                    {t.pauseBtn}
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Square size={14} />}
                  onClick={() => {
                    setIsSending(false);
                    addToast(lang === 'ar' ? 'تم إيقاف حملة البث' : 'Broadcast stopped', 'error');
                  }}
                >
                  {t.stopBtn}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ltr:ml-auto rtl:mr-auto text-danger"
                  onClick={() => setIsEmergencyOpen(true)}
                >
                  Simulate Ban Tripwire
                </Button>
              </div>
            </section>
          )}

          {/* S11: Scheduled Campaigns Queue Table */}
          {scheduledList.length > 0 && (
            <section className="card-glass p-5">
              <h3 className="font-bold text-sm text-text mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-accent" />
                <span>{t.scheduledTitle}</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-text ltr:text-left rtl:text-right">
                  <thead>
                    <tr className="border-b border-border text-text-muted">
                      <th className="py-2.5 px-3">{t.colDate}</th>
                      <th className="py-2.5 px-3">{t.colGuild}</th>
                      <th className="py-2.5 px-3">{t.colTarget}</th>
                      <th className="py-2.5 px-3">{t.colStatus}</th>
                      <th className="py-2.5 px-3">{t.colAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledList.map((sched) => (
                      <tr key={sched.id} className="border-b border-border/40 hover:bg-surface/50">
                        <td className="py-3 px-3">{new Date(sched.scheduledAt).toLocaleString()}</td>
                        <td className="py-3 px-3">{sched.guildName}</td>
                        <td className="py-3 px-3">{sched.targetDescription}</td>
                        <td className="py-3 px-3 text-warning font-semibold">{sched.status}</td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setScheduledList(scheduledList.filter((s) => s.id !== sched.id));
                              addToast(lang === 'ar' ? 'تم إلغاء الجدولة' : 'Schedule cancelled', 'info');
                            }}
                            className="text-danger hover:underline p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* S10: Historical Logs Table */}
          <section className="card-glass p-5">
            <h3 className="font-bold text-sm text-text mb-3">{t.logsTitle}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-text ltr:text-left rtl:text-right">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="py-2.5 px-3">{t.colDate}</th>
                    <th className="py-2.5 px-3">{t.colGuild}</th>
                    <th className="py-2.5 px-3">{t.colPreview}</th>
                    <th className="py-2.5 px-3">{t.colTotal}</th>
                    <th className="py-2.5 px-3 text-success">{t.colSuccess}</th>
                    <th className="py-2.5 px-3 text-danger">{t.colFail}</th>
                    <th className="py-2.5 px-3">{t.colRatio}</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/40 hover:bg-surface/50">
                      <td className="py-3 px-3">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-medium">{log.guildName}</td>
                      <td className="py-3 px-3 text-text-muted">{log.messagePreview}</td>
                      <td className="py-3 px-3 font-mono">{log.total}</td>
                      <td className="py-3 px-3 font-mono text-success">{log.sent}</td>
                      <td className="py-3 px-3 font-mono text-danger">{log.failed}</td>
                      <td className="py-3 px-3 font-mono font-bold text-accent">{log.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebars & Global Metrics) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* S06: Message Templates Drawer */}
          <section className="card-glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-text flex items-center gap-2">
                <BookmarkPlus size={16} className="text-accent" />
                <span>{t.templatesTitle}</span>
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3 bg-surface/70 border border-border rounded-lg flex items-center justify-between hover:border-accent transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-xs text-text truncate">{tpl.name}</h5>
                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                      {tpl.content || tpl.embed?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2">
                    <button
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-accent/20 text-accent hover:bg-accent hover:text-white transition-colors"
                    >
                      {t.applyTemplate}
                    </button>
                    <button
                      onClick={() => {
                        setTemplates(templates.filter((item) => item.id !== tpl.id));
                        addToast(lang === 'ar' ? 'تم حذف القالب' : 'Template deleted', 'info');
                      }}
                      className="p-1 text-text-muted hover:text-danger transition-colors"
                      aria-label="Delete template"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* S10: Global Analytics KPIs */}
          <section className="flex flex-col gap-3.5">
            <h3 className="font-bold text-sm text-text px-1 flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" />
              <span>{t.statsTitle}</span>
            </h3>

            <StatCard
              label={t.statTotalSent}
              value={mockStats.totalSent.toLocaleString()}
              icon={<Send size={20} />}
              color="purple"
            />
            <StatCard
              label={t.statTotalFailed}
              value={mockStats.totalFailed.toLocaleString()}
              icon={<AlertCircle size={20} />}
              color="red"
            />
            <StatCard
              label={t.statSuccessRate}
              value={mockStats.successRatio}
              icon={<CheckCircle size={20} />}
              color="green"
            />
          </section>
        </div>
      </main>

      {/* S05: Discord Live Message Preview Modal */}
      <DiscordPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        message={getMessagePayload()}
        botInfo={botInfo}
        title={t.previewModalTitle}
      />

      {/* S09: Emergency Bot Ban Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        title={t.emergencyTitle}
        description={t.emergencyDesc}
        statsSummary="📊 نتائج حتى التوقف: تم بنجاح: 42 | فشل: 2 | الإجمالي: 44"
        buttonLabel={t.emergencyAcknowledge}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
