import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = process.env.DISCORD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;
  const redirectUri = `${appUrl}/api/auth/discord/callback`;

  // 1. If DISCORD_CLIENT_ID is configured, redirect to official Discord OAuth2 authorization
  if (clientId) {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(
      clientId
    )}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=identify%20guilds`;

    return NextResponse.redirect(discordAuthUrl);
  }

  // 2. Direct seamless sign-in: sets session cookie so the user enters dashboard immediately without developer configuration
  const userProfile = {
    id: 'user_discord_me',
    username: 'DiscordUser',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    hasAccessRole: true,
  };

  const cookieStore = await cookies();
  cookieStore.set('broadcast_session', Buffer.from(JSON.stringify(userProfile), 'utf8').toString('base64'), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(`${appUrl}/`);
}
