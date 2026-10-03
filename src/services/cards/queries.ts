import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { CARD_TAGS } from "./tags";
import type { GetSavedCardsResponse } from "@/response-types/cardResponseTypes";

type GetSavedCardsSuccessResponse = Extract<
  GetSavedCardsResponse,
  { status: "success" }
>;

/**
 * Student only. Returns all cards saved by the authenticated student.
 * If the student has never saved a card, an empty list [] is returned.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting student.
 */
export async function getSavedCardsQuery(): Promise<GetSavedCardsSuccessResponse> {
  "use cache: private";
  cacheTag(CARD_TAGS.cards);
  cacheLife("minutes");

  try {
    const res = await apiClient("/cards", {
      method: "GET",
    });
    const json: GetSavedCardsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getSavedCardsQuery failed:", err);
    throw err;
  }
}
