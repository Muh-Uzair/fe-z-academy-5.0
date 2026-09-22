import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { REVIEW_TAGS } from "./tags";
import type {
  GetReviewsResponse,
  GetReviewDetailsResponse,
  GetReviewsByCourseIdStudentResponse,
  GetReviewsByCourseIdResponse,
} from "@/response-types/reviewResponseTypes";


// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetReviewsSuccessResponse = Extract<GetReviewsResponse, { status: "success" }>;
type GetReviewDetailsSuccessResponse = Extract<GetReviewDetailsResponse, { status: "success" }>;
type GetReviewsByCourseIdStudentSuccessResponse = Extract<GetReviewsByCourseIdStudentResponse, { status: "success" }>;
type GetReviewsByCourseIdSuccessResponse = Extract<GetReviewsByCourseIdResponse, { status: "success" }>;

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

type GetReviewsByCourseIdParams = {
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
 * Student only. Returns the single review left by the logged-in student for
 * the given course, or null if they haven't reviewed it yet.
 * Uses 'use cache: private' so the cache entry is scoped to the student.
 */
export async function getReviewByCourseIdAsStudentQuery(
  courseId: string,
): Promise<GetReviewsByCourseIdStudentSuccessResponse> {
  "use cache: private";
  cacheTag(REVIEW_TAGS.reviewByCourse(courseId));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/reviews/course/${courseId}`, {
      method: "GET",
    });
    const json: GetReviewsByCourseIdStudentResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getReviewByCourseIdAsStudentQuery failed:", err);
    throw err;
  }
}

/**
 * Admin / Instructor only. Fetches a paginated list of all reviews for the
 * given course. Admin can access any course; instructor only their own.
 * Uses 'use cache: private' so the cache entry is scoped to the caller.
 */
export async function getReviewsByCourseIdQuery(
  courseId: string,
  params: GetReviewsByCourseIdParams = {},
): Promise<GetReviewsByCourseIdSuccessResponse> {
  "use cache: private";
  cacheTag(REVIEW_TAGS.reviewsByCourse(courseId));
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/reviews/course/${courseId}${query}`, {
      method: "GET",
    });
    const json: GetReviewsByCourseIdResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getReviewsByCourseIdQuery failed:", err);
    throw err;
  }
}
