"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { AUTH_TAGS } from "./tags";
import { DASHBOARD_TAGS } from "@/services/dashboard/tags";
import type {
  SignupResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  SigninResponse,
  RotateTokenResponse,
  SignoutResponse,
  ForgetPasswordResponse,
  ResetPasswordResponse,
} from "@/response-types/authResponseTypes";

async function forwardAuthCookies(response: Response) {
  const cookieStore = await cookies();

  for (const setCookie of response.headers.getSetCookie()) {
    const cookie = parseSetCookie(setCookie);

    if (cookie) {
      cookieStore.set(cookie);
    }
  }
}

export async function signupAction(
  data:
    | {
        fullName: string;
        email: string;
        password: string;
        bio: string;
        highestEducation: string;
        role: "student";
      }
    | {
        fullName: string;
        email: string;
        password: string;
        bio: string;
        highestEducation: string;
        yearsOfExperience: number;
        role: "instructor";
      },
): Promise<SignupResponse> {
  const res = await apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SignupResponse = await res.json();

  if (json.status === "success") {
    updateTag(DASHBOARD_TAGS.admin);
  }

  return json;
}

export async function verifyOtpAction(data: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> {
  const res = await apiClient("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: VerifyOtpResponse = await res.json();

  if (json.status === "success") {
    updateTag(DASHBOARD_TAGS.admin);
  }

  return json;
}

export async function resendOtpAction(data: {
  email: string;
}): Promise<ResendOtpResponse> {
  const res = await apiClient("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ResendOtpResponse = await res.json();

  return json;
}

export async function signinAction(data: {
  email: string;
  password: string;
}): Promise<SigninResponse> {
  const res = await apiClient("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SigninResponse = await res.json();

  // Successful sign-in returns the signed-in user summary and sets cookies.
  // Invalidate the private current-user cache so the next /me fetch sees the
  // fresh session immediately.
  if (json.status === "success") {
    await forwardAuthCookies(res);
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}

export async function rotateTokenAction(): Promise<RotateTokenResponse> {
  const res = await apiClient("/auth/rotate-token", {
    method: "POST",
  });

  const json: RotateTokenResponse = await res.json();

  // After token rotation the cookies change — force a fresh /me on next load.
  if (json.status === "success") {
    await forwardAuthCookies(res);
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}

export async function forgetPasswordAction(data: {
  email: string;
}): Promise<ForgetPasswordResponse> {
  const res = await apiClient("/auth/forget-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ForgetPasswordResponse = await res.json();

  return json;
}

export async function resetPasswordAction(data: {
  otp: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  const res = await apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ResetPasswordResponse = await res.json();

  return json;
}

export async function signoutAction(): Promise<SignoutResponse> {
  const res = await apiClient("/auth/signout", {
    method: "POST",
  });

  const json: SignoutResponse = await res.json();

  if (json.status === "success") {
    await forwardAuthCookies(res);
    updateTag(AUTH_TAGS.currentUser);
    redirect("/signin");
  }

  return json;
}
