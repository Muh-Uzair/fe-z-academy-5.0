import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. If we have an access token, everything is fine. Proceed normally.
  if (accessToken) {
    return NextResponse.next();
  }

  // 2. If we don't have an access token and no refresh token, kick them to sign in.
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. We have a refresh token but no access token. Attempt rotation.
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const rotateUrl = `${baseUrl}/auth/rotate-token`;

    const res = await fetch(rotateUrl, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    // 4. If rotation fails on backend (e.g. refresh token expired), redirect to signin.
    if (!res.ok || data.status !== "success") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 5. Rotation succeeded. Perform the Two-Way Cookie Sync.
    const requestHeaders = new Headers(request.headers);
    const requestCookies = new Map();
    
    // Start with all incoming cookies
    for (const cookie of request.cookies.getAll()) {
      requestCookies.set(cookie.name, cookie.value);
    }

    // Extract the Set-Cookie headers from the Express backend
    const setCookieHeaders = res.headers.getSetCookie();

    for (const setCookieStr of setCookieHeaders) {
      // Manually parse out the name and value to update the request cookies
      const parts = setCookieStr.split(";")[0];
      const equalIndex = parts.indexOf("=");
      if (equalIndex !== -1) {
        const name = parts.substring(0, equalIndex).trim();
        const value = parts.substring(equalIndex + 1).trim();
        requestCookies.set(name, value);
      }
    }

    // Now stringify the Map back into a single Cookie string for the incoming request
    const newCookieHeader = Array.from(requestCookies.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");

    // Inject it into the request headers BEFORE sending to Server Components
    requestHeaders.set("Cookie", newCookieHeader);

    // Prepare the downstream response with the updated request headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Finally, set the Set-Cookie headers on the response so the browser saves them
    for (const setCookieStr of setCookieHeaders) {
      response.headers.append("Set-Cookie", setCookieStr);
    }

    return response;

  } catch (error) {
    // If the network call to Express fails completely, redirect to signin to be safe
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/student/:path*"],
};
