'use server';

import { fetchClient } from '@/utils/fetchClient';
import { updateTag } from 'next/cache';
import { AUTH_TAGS } from './tags';
import type {
  SignupResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  SigninResponse,
  RotateTokenResponse,
} from '@/response-types/authResponseTypes';

export async function signupAction(data: any): Promise<SignupResponse> {
  const res = await fetchClient('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function verifyOtpAction(data: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> {
  const res = await fetchClient('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function resendOtpAction(data: {
  email: string;
}): Promise<ResendOtpResponse> {
  const res = await fetchClient('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function signinAction(data: any): Promise<SigninResponse> {
  const res = await fetchClient('/api/v1/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const json: SigninResponse = await res.json();

  // Immediately invalidate the private 'current-user' cache so the next
  // call to getMeQuery hits the backend with the fresh session cookies.
  if (json.status === 'success') {
    updateTag(AUTH_TAGS.current_user);
  }

  return json;
}

export async function rotateTokenAction(): Promise<RotateTokenResponse> {
  const res = await fetchClient('/api/v1/auth/rotate-token', {
    method: 'POST',
  });

  const json: RotateTokenResponse = await res.json();

  // After token rotation the cookies change — force a fresh /me on next load.
  if (json.status === 'success') {
    updateTag(AUTH_TAGS.current_user);
  }

  return json;
}

export async function signoutAction(): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  // Immediately expire the private 'current-user' cache.
  updateTag(AUTH_TAGS.current_user);
}
