import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { BotInfo, DiscordGuild, DiscordRole, MessagePayload } from '@/types';

// Active in-memory bot tokens and client instances (keyed by user ID)
const activeTokens = new Map<string, string>();
const activeClients = new Map<string, Client>();

export function setActiveBotToken(userId: string, token: string) {
  activeTokens.set(userId, token);
}

export function getActiveBotToken(userId: string): string | null {
  return activeTokens.get(userId) || null;
}

export function removeActiveBotToken(userId: string) {
  activeTokens.delete(userId);
  stopBotClient(userId);
}

export function getActiveClient(userId: string): Client | undefined {
  return activeClients.get(userId);
}

/**
 * Connects a persistent Gateway WebSocket Client to keep the bot ONLINE (🟢) on Discord.
 */
export async function startBotClient(userId: string, token: string): Promise<Client> {
  const existing = activeClients.get(userId);
  if (existing) {
    try {
      existing.destroy();
    } catch {
      // ignore
    }
    activeClients.delete(userId);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.DirectMessages,
    ],
  });

  await client.login(token);
  activeClients.set(userId, client);
  return client;
}

export function stopBotClient(userId: string) {
  const client = activeClients.get(userId);
  if (client) {
    try {
      client.destroy();
    } catch {
      // ignore
    }
    activeClients.delete(userId);
  }
}

/**
 * Fetches real human members from a Discord server filtered by selected roles.
 * Resilient multi-strategy: Gateway cache first, then REST API fallback.
 */
export async function fetchGuildTargetMembers(
  userId: string,
  guildId: string,
  roleIds: string[],
  sendToAll: boolean
): Promise<Array<{ id: string; username: string }>> {
  const token = getActiveBotToken(userId);
  const targetMembers: Array<{ id: string; username: string }> = [];

  // Strategy 1: Gateway Client (if present and ready)
  const client = activeClients.get(userId);
  if (client) {
    try {
      if (!client.isReady()) {
        await Promise.race([
          new Promise((resolve) => client.once('ready', resolve)),
          new Promise((resolve) => setTimeout(resolve, 2500)),
        ]);
      }

      const guild = client.guilds.cache.get(guildId) || (await client.guilds.fetch(guildId).catch(() => null));
      if (guild) {
        const members = await guild.members.fetch({ time: 8000 }).catch(() => guild.members.cache);
        for (const [, member] of members) {
          if (member.user.bot) continue; // skip other bots
          if (
            sendToAll ||
            roleIds.length === 0 ||
            roleIds.some((rId) => rId.includes('all') || member.roles.cache.has(rId))
          ) {
            targetMembers.push({
              id: member.user.id,
              username: member.user.username,
            });
          }
        }
      }
    } catch (e) {
      console.warn('Gateway member fetch failed, falling back to REST API:', e);
    }
  }

  // Strategy 2: Direct Discord REST API v10 fallback
  if (targetMembers.length === 0 && token) {
    try {
      const rest = new REST({ version: '10' }).setToken(token);
      const rawMembers = (await rest.get(`/guilds/${guildId}/members?limit=1000`)) as Array<{
        user: { id: string; username: string; bot?: boolean };
        roles: string[];
      }>;

      for (const m of rawMembers) {
        if (m.user.bot) continue;
        if (
          sendToAll ||
          roleIds.length === 0 ||
          roleIds.some((rId) => rId.includes('all') || (m.roles && m.roles.includes(rId)))
        ) {
          targetMembers.push({
            id: m.user.id,
            username: m.user.username,
          });
        }
      }
    } catch (e: any) {
      console.warn('REST member fetch error:', e.message);
    }
  }

  return targetMembers;
}

/**
 * Validates a bot token against Discord REST API and verifies basic Gateway connectivity.
 */
export async function validateAndConnectBot(token: string): Promise<BotInfo> {
  const rest = new REST({ version: '10' }).setToken(token);
  
  // 1. Fetch bot application user
  const user = await rest.get(Routes.user()) as {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
  };

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  return {
    id: user.id,
    username: user.username,
    avatar: avatarUrl,
    discriminator: user.discriminator,
  };
}

/**
 * Retrieves mutual guilds and roles for the authenticated bot.
 */
export async function getBotGuilds(token: string): Promise<DiscordGuild[]> {
  const rest = new REST({ version: '10' }).setToken(token);
  const rawGuilds = await rest.get('/users/@me/guilds?with_counts=true') as Array<{
    id: string;
    name: string;
    icon: string | null;
    approximate_member_count?: number;
  }>;

  const guildsWithRoles = await Promise.all(
    rawGuilds.map(async (g) => {
      let roles: DiscordRole[] = [];
      try {
        roles = await getGuildRoles(token, g.id);
      } catch (err) {
        console.warn(`Could not load roles for guild ${g.name} (${g.id}):`, err);
      }

      // If no custom roles found, provide an Everyone fallback role
      if (roles.length === 0) {
        roles = [
          { id: `${g.id}_all`, name: 'All Members (الجميع)', color: '#0ea5e9', memberCount: g.approximate_member_count || 1 },
        ];
      }

      return {
        id: g.id,
        name: g.name,
        memberCount: g.approximate_member_count || 1,
        icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : undefined,
        roles,
      };
    })
  );

  return guildsWithRoles;
}

/**
 * Fetches roles for a specific guild with hex colors.
 */
export async function getGuildRoles(token: string, guildId: string): Promise<DiscordRole[]> {
  const rest = new REST({ version: '10' }).setToken(token);
  const rawRoles = await rest.get(Routes.guildRoles(guildId)) as Array<{
    id: string;
    name: string;
    color: number;
    managed: boolean;
  }>;

  return rawRoles
    .filter((r) => r.name !== '@everyone' && !r.managed)
    .map((r) => ({
      id: r.id,
      name: r.name,
      color: r.color && r.color !== 0 ? `#${r.color.toString(16).padStart(6, '0')}` : '#7c3aed',
      memberCount: 0,
    }));
}

/**
 * Sends a single DM to a specific user using Discord REST API.
 */
export async function sendDirectMessage(
  token: string,
  targetUserId: string,
  message: MessagePayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const rest = new REST({ version: '10' }).setToken(token);

    // 1. Create DM Channel
    const channel = await rest.post(Routes.userChannels(), {
      body: { recipient_id: targetUserId },
    }) as { id: string };

    // 2. Prepare Payload
    const body: { content?: string; embeds?: unknown[]; files?: unknown[] } = {};
    if (message.content) body.content = message.content;

    const embeds: any[] = [];
    if (message.embed) {
      embeds.push({
        title: message.embed.title,
        description: message.embed.description,
        color: message.embed.color ? parseInt(message.embed.color.replace('#', ''), 16) : 0x7c3aed,
        image: message.embed.image ? { url: message.embed.image } : undefined,
      });
    }

    if (message.imageUrl) {
      embeds.push({
        image: { url: message.imageUrl },
        color: 0x7c3aed,
      });
    }

    if (embeds.length > 0) {
      body.embeds = embeds;
    }

    // Discord requires either content, embeds, or files
    if (!body.content && (!body.embeds || body.embeds.length === 0)) {
      body.content = '👋';
    }

    // 3. Dispatch Message
    await rest.post(Routes.channelMessages(channel.id), { body });
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 50007) {
      return { success: false, error: 'dm_closed' };
    }
    if (error.code === 40001 || error.code === 40002 || error.code === 401 || error.code === 403) {
      return { success: false, error: 'forbidden' };
    }
    return { success: false, error: error.message || 'unknown' };
  }
}
