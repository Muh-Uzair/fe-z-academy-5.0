import "server-only";
import { cookies } from "next/headers";

export async function apiClient(
  endpoint: string,
  init: RequestInit = {},
  options: { includeCookies?: boolean } = {},
) {
  const { includeCookies = true } = options;

  const headers = new Headers(init.headers);

  if (includeCookies) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }
  }

  const method = (init.method || "GET").toUpperCase();
  const hasBody = init.body !== undefined && init.body !== null;

  if (
    hasBody &&
    !headers.has("Content-Type") &&
    method !== "GET" &&
    method !== "HEAD"
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const baseUrl = process.env.API_URL || "http://localhost:5000/api/v1";
  const url = `${baseUrl}${endpoint}`;

  console.log(`${method} ${url}`);

  return fetch(url, {
    ...init,
    headers,
  });
}
