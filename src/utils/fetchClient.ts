import 'server-only';
import { cookies } from 'next/headers';

/**
 * A wrapper around native fetch for Server Actions and Server Components.
 * - Automatically attaches cookies (like accessToken/refreshToken) from the browser to the backend request.
 * - Automatically captures Set-Cookie headers from the backend response and applies them to the browser.
 */
export async function fetchClient(endpoint: string, init?: RequestInit) {
  const cookieStore = await cookies();
  
  // Forward all current cookies to the backend
  const cookieStrings = cookieStore.getAll().map(c => `${c.name}=${c.value}`);
  const cookieHeader = cookieStrings.join('; ');

  const headers = new Headers(init?.headers);
  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }
  
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers,
  });

  // Forward Set-Cookie from backend back to the client
  const setCookies = response.headers.getSetCookie();
  if (setCookies && setCookies.length > 0) {
    for (const cookieStr of setCookies) {
      // Basic parsing of the Set-Cookie string.
      // Example: accessToken=abc; Max-Age=604800; Path=/; HttpOnly; SameSite=Strict
      const parts = cookieStr.split(';').map(part => part.trim());
      const [nameValue, ...options] = parts;
      const nameValueSplitIndex = nameValue.indexOf('=');
      if (nameValueSplitIndex === -1) continue;
      
      const name = nameValue.substring(0, nameValueSplitIndex);
      const value = nameValue.substring(nameValueSplitIndex + 1);
      
      let maxAge: number | undefined = undefined;
      for (const opt of options) {
        if (opt.toLowerCase().startsWith('max-age=')) {
          maxAge = parseInt(opt.substring(8));
        }
      }

      // We explicitly set the security defaults based on the integration guide
      cookieStore.set({
        name,
        value,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        ...(maxAge !== undefined && { maxAge })
      });
    }
  }

  return response;
}
