import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('broadcast_session');
  cookieStore.set('broadcast_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`;
  const cookieStore = await cookies();
  cookieStore.delete('broadcast_session');
  cookieStore.set('broadcast_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return NextResponse.redirect(`${appUrl}/`);
}
