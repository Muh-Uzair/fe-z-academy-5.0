import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { fetchClient } from '@/utils/fetchClient';
import { AUTH_TAGS } from './tags';
import type { GetMeResponse, PublicUser } from '@/response-types/authResponseTypes';

/**
 * Fetches the current authenticated user.
 * Uses 'use cache: private' — result is cached in the user's own browser,
 * NOT on the shared Next.js server cache. This is correct because every
 * user gets a different response from /me.
 * Use updateTag(AUTH_TAGS.current_user) to immediately invalidate this.
 */
export async function getMeQuery(): Promise<PublicUser | null> {
  'use cache: private';
  cacheTag(AUTH_TAGS.current_user);
  cacheLife('hours');

  try {
    const res = await fetchClient('/api/v1/auth/me', {
      method: 'GET',
    });

    if (!res.ok) {
      // 401 Unauthorized — user is not logged in
      return null;
    }

    const json: GetMeResponse = await res.json();

    if (json.status === 'success') {
      return json.data.user;
    }

    return null;
  } catch (error) {
    console.error('Error in getMeQuery:', error);
    return null;
  }
}
