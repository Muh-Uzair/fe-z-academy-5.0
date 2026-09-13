import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { REVIEW_TAGS } from "./tags";
import type {
  GetReviewsResponse,
  GetReviewDetailsResponse,
  GetMyReviewsResponse,
  GetReviewByCourseAndStudentResponse,
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
type GetMyReviewsSuccessResponse = Extract<
  GetMyReviewsResponse,
  { status: "success" }
>;
type GetReviewByCourseAndStudentSuccessResponse = Extract<
  GetReviewByCourseAndStudentResponse,
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

type GetMyReviewsParams = {
  course?: string;
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

/**
 * Student only. Fetches a paginated, sortable, searchable, filterable list
 * of reviews left by the logged-in student — reviewBy is always scoped to
 * the caller and cannot be overridden.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * student, based on the cookies read inside apiClient.
 */
export async function getMyReviewsQuery(
  params: GetMyReviewsParams = {},
): Promise<GetMyReviewsSuccessResponse> {
  "use cache: private";
  cacheTag(REVIEW_TAGS.myReviews);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/reviews/me${query}`, {
      method: "GET",
    });
    const json: GetMyReviewsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getMyReviewsQuery failed:", err);
    throw err;
  }
}

/**
 * Student only. Looks up the single review (if any) left by the logged-in
 * student for the given course — the student id is taken from the
 * accessToken cookie, not the URL.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * student, based on the cookies read inside apiClient.
 */
export async function getReviewByCourseAndStudentQuery(
  courseId: string,
): Promise<GetReviewByCourseAndStudentSuccessResponse> {
  "use cache: private";
  cacheTag(REVIEW_TAGS.reviewByCourse(courseId));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/reviews/course/${courseId}`, {
      method: "GET",
    });
    const json: GetReviewByCourseAndStudentResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getReviewByCourseAndStudentQuery failed:", err);
    throw err;
  }
}
