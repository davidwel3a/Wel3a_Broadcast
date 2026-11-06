import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;
  const redirectUri = `${appUrl}/api/auth/discord/callback`;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?auth_error=no_code`);
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/?oauth_setup=true`);
  }

  try {
    // 1. Exchange OAuth2 Authorization Code for Access Token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Discord token exchange failed:', errText);
      return NextResponse.redirect(`${appUrl}/?auth_error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated Discord user profile
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${appUrl}/?auth_error=user_fetch_failed`);
    }

    const discordUser = await userResponse.json();

    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const userProfile = {
      id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar: avatarUrl,
      hasAccessRole: true,
    };

    // 3. Set persistent session cookie (30 days)
    const sessionCookieValue = Buffer.from(JSON.stringify(userProfile), 'utf8').toString('base64');
    const cookieStore = await cookies();
    cookieStore.set('broadcast_session', sessionCookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.redirect(`${appUrl}/`);
  } catch (error) {
    console.error('Discord OAuth Callback error:', error);
    return NextResponse.redirect(`${appUrl}/?auth_error=unknown`);
  }
}
