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

  if (init.body) {
    let parsedBody = init.body;
    try {
      if (typeof init.body === "string") parsedBody = JSON.parse(init.body);
    } catch (e) {}
    console.log("------------------------------\n", "requestBody \n", parsedBody);
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  try {
    const clonedRes = res.clone();
    const json = await clonedRes.json();
    console.log(
      "responseBody \n",
      json,
      "\n",
      "------------------------------ \n"
    );
  } catch (error) {
    console.log(
      "responseBody \n",
      "[Could not parse JSON response or no body]",
      "\n",
      "------------------------------ \n"
    );
  }

  return res;
}
