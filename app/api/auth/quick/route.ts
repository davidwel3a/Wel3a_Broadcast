import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = (body.username || 'PersonalAccount').trim();
    const id = (body.id || '00000000-0000-0000-0000-000000000001').trim();

    const userProfile = {
      id,
      username,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      hasAccessRole: true,
    };

    const cookieStore = await cookies();
    cookieStore.set('broadcast_session', Buffer.from(JSON.stringify(userProfile), 'utf8').toString('base64'), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true, user: userProfile });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
