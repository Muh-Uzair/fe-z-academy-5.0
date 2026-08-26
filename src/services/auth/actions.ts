"use server";

import { apiClient } from "@/utils/apiClient";
import { updateTag } from "next/cache";
import { AUTH_TAGS } from "./tags";
import type {
  SignupResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  SigninResponse,
  RotateTokenResponse,
} from "@/response-types/authResponseTypes";

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
  console.log("requestBody ------------------------- \n", data);
  const res = await apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SignupResponse = await res.json();
  console.log("responseBody ------------------------- \n", json);

  return json;
}

export async function verifyOtpAction(data: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> {
  console.log("requestBody ------------------------- \n", data);
  const res = await apiClient("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: VerifyOtpResponse = await res.json();
  console.log("responseBody ------------------------- \n", json);

  return json;
}

export async function resendOtpAction(data: {
  email: string;
}): Promise<ResendOtpResponse> {
  console.log("requestBody ------------------------- \n", data);
  const res = await apiClient("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: ResendOtpResponse = await res.json();
  console.log("responseBody ------------------------- \n", json);

  return json;
}

export async function signinAction(data: {
  email: string;
  password: string;
}): Promise<SigninResponse> {
  console.log("requestBody ------------------------- \n", data);
  const res = await apiClient("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: SigninResponse = await res.json();
  console.log("responseBody ------------------------- \n", json);

  // Immediately invalidate the private 'current-user' cache so the next
  // call to getMeQuery hits the backend with the fresh session cookies.
  if (json.status === "success") {
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}

export async function rotateTokenAction(): Promise<RotateTokenResponse> {
  console.log("requestBody ------------------------- \n", "no body");
  const res = await apiClient("/auth/rotate-token", {
    method: "POST",
  });

  const json: RotateTokenResponse = await res.json();
  console.log("responseBody ------------------------- \n", json);

  // After token rotation the cookies change — force a fresh /me on next load.
  if (json.status === "success") {
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}
