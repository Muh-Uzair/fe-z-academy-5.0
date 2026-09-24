import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { STAT_TAGS } from "./tags";
import type { GetPlatformStatsResponse } from "@/response-types/statResponseTypes";

type GetPlatformStatsSuccessResponse = Extract<
  GetPlatformStatsResponse,
  { status: "success" }
>;

/**
 * No authentication required — cookies are not sent.
 * Uses a shared (non-private) 'use cache' since the response doesn't depend
 * on the caller's identity.
 */
export async function getPlatformStatsQuery(): Promise<GetPlatformStatsSuccessResponse> {
  "use cache";
  cacheTag(STAT_TAGS.platformStats);
  cacheLife("minutes");

  try {
    const res = await apiClient(
      `/stats`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetPlatformStatsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getPlatformStatsQuery failed:", err);
    throw err;
  }
}
