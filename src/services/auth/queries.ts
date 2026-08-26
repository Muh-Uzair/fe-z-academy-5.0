import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/utils/apiClient";
import { AUTH_TAGS } from "./tags";
import type { GetMeResponse } from "@/response-types/authResponseTypes";

type GetMeSuccessResponse = Extract<GetMeResponse, { status: "success" }>;

/**
 * Fetches the complete successful current-user API response.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * user, based on the cookies read inside apiClient.
 * Use updateTag(AUTH_TAGS.currentUser) to immediately invalidate this.
 */
export async function getMeQuery(): Promise<GetMeSuccessResponse> {
  "use cache: private";
  cacheTag(AUTH_TAGS.currentUser);
  cacheLife("hours");

  const res = await apiClient("/auth/me", {
    method: "GET",
  });
  const json: GetMeResponse = await res.json();

  if (json.status === "success") {
    return json;
  }

  throw new Error(json.message);
}
