import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = process.env.DISCORD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;
  const redirectUri = `${appUrl}/api/auth/discord/callback`;

  if (!clientId) {
    // If client ID is not configured yet, redirect with setup flag
    return NextResponse.redirect(`${appUrl}/?oauth_setup=true`);
  }

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(
    clientId
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=identify%20guilds`;

  return NextResponse.redirect(discordAuthUrl);
}
