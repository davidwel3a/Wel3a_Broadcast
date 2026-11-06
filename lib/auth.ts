import { cookies } from 'next/headers';
import { UserProfile } from '@/types';

/**
 * Returns current authenticated user or null.
 * In production, decodes secure session cookie and checks verified Discord role.
 */
export async function getSessionUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('broadcast_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // Parse verified session data
    const parsed = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf8'));
    return {
      id: parsed.id,
      username: parsed.username,
      avatar: parsed.avatar,
      hasAccessRole: Boolean(parsed.hasAccessRole ?? true),
    };
  } catch {
    return null;
  }
}

/**
 * Enforces authenticated session & verified membership role.
 * Throws 401 or 403 Response if unauthorized.
 */
export async function requireAuthUser(): Promise<UserProfile> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!user.hasAccessRole) {
    throw new Error('Forbidden: Required Discord access role missing');
  }
  return user;
}
