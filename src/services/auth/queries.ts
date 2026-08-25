import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { apiClient } from '@/utils/apiClient';
import { AUTH_TAGS } from './tags';
import type { GetMeResponse, PublicUser } from '@/response-types/authResponseTypes';

/**
 * Fetches the current authenticated user.
 * Uses 'use cache: private' — the cache entry is scoped to the requesting
 * user (keyed off the cookies read inside apiClient), so it is never shared
 * across users, unlike the default Next.js cache which is shared server-side.
 * Use updateTag(AUTH_TAGS.current_user) to immediately invalidate this.
 */
export async function getMeQuery(): Promise<PublicUser | null> {
  'use cache: private';
  cacheTag(AUTH_TAGS.current_user);
  cacheLife('hours');

  try {
    const res = await apiClient('/auth/me', {
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
