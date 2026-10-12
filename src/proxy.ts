import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLES = ["admin", "instructor", "student"] as const;
type Role = (typeof ROLES)[number];

// Reads the role from the JWT payload WITHOUT verifying the signature. It is
// only used to send users to their own workspace; the backend still verifies
// the token on every API call and the role layouts re-check the verified
// /auth/me user. Returns null if the role can't be read, so nothing is blocked.
function getRoleFromToken(token: string | undefined): Role | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { role } = JSON.parse(json);

    return ROLES.includes(role) ? role : null;
  } catch {
    return null;
  }
}

// If the user is inside another role's workspace (e.g. an admin on
// /instructor/*), returns their own dashboard URL; otherwise null.
function getOwnDashboardUrl(request: NextRequest, role: Role | null) {
  if (!role) return null;

  const { pathname } = request.nextUrl;
  const inOtherWorkspace = ROLES.some(
    (other) =>
      other !== role &&
      (pathname === `/${other}` || pathname.startsWith(`/${other}/`)),
  );

  return inOtherWorkspace ? new URL(`/${role}/dashboard`, request.url) : null;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. If we have an access token, the session is fine. Only make sure the
  // user is in their own workspace, then proceed normally.
  if (accessToken) {
    const dashboardUrl = getOwnDashboardUrl(
      request,
      getRoleFromToken(accessToken),
    );

    return dashboardUrl
      ? NextResponse.redirect(dashboardUrl)
      : NextResponse.next();
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

    // Prepare the downstream response with the updated request headers, or
    // redirect to the user's own dashboard if they are in another workspace.
    // The rotated cookies below are set on either response.
    const dashboardUrl = getOwnDashboardUrl(
      request,
      getRoleFromToken(requestCookies.get("accessToken")),
    );
    const response = dashboardUrl
      ? NextResponse.redirect(dashboardUrl)
      : NextResponse.next({
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
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/student/:path*",
    "/course-checkout/:path*",
  ],
};
