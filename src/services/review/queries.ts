import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { REVIEW_TAGS } from "./tags";
import type {
  GetReviewsResponse,
  GetReviewDetailsResponse,
} from "@/response-types/reviewResponseTypes";

// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetReviewsSuccessResponse = Extract<
  GetReviewsResponse,
  { status: "success" }
>;
type GetReviewDetailsSuccessResponse = Extract<
  GetReviewDetailsResponse,
  { status: "success" }
>;

type GetReviewsParams = {
  course?: string;
  instructor?: string;
  reviewBy?: string;
  rating?: number;
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Public — no accessToken cookie required. Fetches a paginated, sortable,
 * searchable, filterable list of reviews with reviewByDetails/courseDetails/
 * instructorDetails joined in.
 * Uses a shared (non-private) 'use cache' since the response doesn't depend
 * on the caller's identity.
 */
export async function getReviewsQuery(
  params: GetReviewsParams = {},
): Promise<GetReviewsSuccessResponse> {
  "use cache";
  cacheTag(REVIEW_TAGS.reviews);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(
      `/reviews${query}`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetReviewsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getReviewsQuery failed:", err);
    throw err;
  }
}

/**
 * Public — no accessToken cookie required. Fetches a single review by id,
 * with references joined.
 * Uses a shared (non-private) 'use cache' since the response doesn't depend
 * on the caller's identity.
 */
export async function getReviewDetailsQuery(
  id: string,
): Promise<GetReviewDetailsSuccessResponse> {
  "use cache";
  cacheTag(REVIEW_TAGS.reviewDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(
      `/reviews/${id}`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetReviewDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getReviewDetailsQuery failed:", err);
    throw err;
  }
}
