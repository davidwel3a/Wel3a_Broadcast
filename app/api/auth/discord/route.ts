import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || url.host;
  const proto = req.headers.get('x-forwarded-proto') || (url.protocol.replace(':', '') || 'https');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
  const redirectUri = `${appUrl}/api/auth/discord/callback`;

  const clientId = process.env.DISCORD_CLIENT_ID || '1568387283147563188';

  // Clear any existing dummy session before starting authentic OAuth2 flow
  const cookieStore = await cookies();
  cookieStore.delete('broadcast_session');

  // Direct always to official Discord OAuth2 authorization screen
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(
    clientId
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=identify%20guilds`;

  return NextResponse.redirect(discordAuthUrl);
}
