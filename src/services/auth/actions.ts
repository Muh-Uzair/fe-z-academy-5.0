"use server";

import { apiClient } from "@/utils/apiClient";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { AUTH_TAGS } from "./tags";
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
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SignupResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  return json;
}

export async function verifyOtpAction(data: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> {
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: VerifyOtpResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  return json;
}

export async function resendOtpAction(data: {
  email: string;
}): Promise<ResendOtpResponse> {
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ResendOtpResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  return json;
}

export async function signinAction(data: {
  email: string;
  password: string;
}): Promise<SigninResponse> {
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SigninResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

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
  console.log("------------------------------\n", "requestBody \n", "no body");
  const res = await apiClient("/auth/rotate-token", {
    method: "POST",
  });

  const json: RotateTokenResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

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
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/forget-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ForgetPasswordResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  return json;
}

export async function resetPasswordAction(data: {
  otp: string;
  newPassword: string;
}): Promise<ResetPasswordResponse> {
  console.log("------------------------------\n", "requestBody \n", data);
  const res = await apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ResetPasswordResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  return json;
}

export async function signoutAction(): Promise<SignoutResponse> {
  console.log("------------------------------\n", "requestBody \n", "no body");
  const res = await apiClient("/auth/signout", {
    method: "POST",
  });

  const json: SignoutResponse = await res.json();
  console.log(
    "responseBody \n",
    json,
    "\n",
    "------------------------------ \n",
  );

  if (json.status === "success") {
    await forwardAuthCookies(res);
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}
