import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { COURSE_TAGS } from "./tags";
import type {
  GetCoursesResponse,
  GetCourseDetailsResponse,
  GetCourseCompletionStatusResponse,
  GetCourseRefundEligibilityResponse,
  GetPublicCoursesResponse,
  GetPublicCourseDetailsResponse,
  GetInstructorCoursesResponse,
  GetStudentCoursesResponse,
  CourseStatus,
} from "@/response-types/courseResponseTypes";

// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetCoursesSuccessResponse = Extract<
  GetCoursesResponse,
  { status: "success" }
>;
type GetCourseDetailsSuccessResponse = Extract<
  GetCourseDetailsResponse,
  { status: "success" }
>;
type GetCourseCompletionStatusSuccessResponse = Extract<
  GetCourseCompletionStatusResponse,
  { status: "success" }
>;
type GetCourseRefundEligibilitySuccessResponse = Extract<
  GetCourseRefundEligibilityResponse,
  { status: "success" }
>;
type GetPublicCoursesSuccessResponse = Extract<
  GetPublicCoursesResponse,
  { status: "success" }
>;
type GetPublicCourseDetailsSuccessResponse = Extract<
  GetPublicCourseDetailsResponse,
  { status: "success" }
>;
type GetInstructorCoursesSuccessResponse = Extract<
  GetInstructorCoursesResponse,
  { status: "success" }
>;
type GetStudentCoursesSuccessResponse = Extract<
  GetStudentCoursesResponse,
  { status: "success" }
>;

type GetCoursesParams = {
  search?: string;
  projection?: string;
  instructor?: string;
  isVerified?: "true" | "false";
  verificationRejectionReason?: "null";
  status?: CourseStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type GetPublicCoursesParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

/**
 * Requires an authenticated session — anonymous callers are rejected with
 * 401. Fetches a paginated, sortable, searchable list of courses. Visibility
 * depends on the caller's role: students see only courses they're enrolled
 * in, instructors see only their own (including unverified/rejected ones),
 * admins see all.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 * Use updateTag(COURSE_TAGS.courses) to invalidate this after a
 * create/update/delete/verification change.
 */
export async function getCoursesQuery(
  params: GetCoursesParams = {},
): Promise<GetCoursesSuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.courses);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/courses${query}`, {
      method: "GET",
    });
    const json: GetCoursesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCoursesQuery failed:", err);
    throw err;
  }
}

/**
 * Requires an authenticated session (unlike getCoursesQuery, anonymous
 * callers are rejected with 401). Visibility depends on the caller's role:
 * admins can fetch any course, instructors only their own, students only a
 * course they're enrolled in — so the response varies by caller identity.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 * Use updateTag(COURSE_TAGS.courseDetails(id)) to invalidate this after an
 * update/verification change.
 */
export async function getCourseDetailsQuery(
  id: string,
): Promise<GetCourseDetailsSuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.courseDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/courses/${id}`, {
      method: "GET",
    });
    const json: GetCourseDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCourseDetailsQuery failed:", err);
    throw err;
  }
}

/**
 * Student only. Requires an existing enrollment.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * student, based on the cookies read inside apiClient.
 */
export async function getCourseCompletionStatusQuery(
  id: string,
): Promise<GetCourseCompletionStatusSuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.completionStatus(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/courses/${id}/completion-status`, {
      method: "GET",
    });
    const json: GetCourseCompletionStatusResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCourseCompletionStatusQuery failed:", err);
    throw err;
  }
}

/**
 * Student only. Read-only check that runs the same rules as
 * requestCourseRefundAction (payment state, 7-day window, 30% watch limit)
 * without claiming the transaction or calling Stripe. Use it to show/hide a
 * "Request refund" button and explain why it's disabled.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * student, based on the cookies read inside apiClient.
 */
export async function getCourseRefundEligibilityQuery(
  id: string,
): Promise<GetCourseRefundEligibilitySuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.refundEligibility(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/courses/${id}/refund-eligibility`, {
      method: "GET",
    });
    const json: GetCourseRefundEligibilityResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCourseRefundEligibilityQuery failed:", err);
    throw err;
  }
}

/**
 * No authentication required — cookies are not sent. Always scoped to
 * verified courses only. Does not return videoUrl.
 * Uses a shared (non-private) 'use cache' since the response doesn't depend
 * on the caller's identity.
 */
export async function getPublicCoursesQuery(
  params: GetPublicCoursesParams = {},
): Promise<GetPublicCoursesSuccessResponse> {
  "use cache";
  cacheTag(COURSE_TAGS.publicCourses);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(
      `/courses/public${query}`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetPublicCoursesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getPublicCoursesQuery failed:", err);
    throw err;
  }
}

/**
 * No authentication required — cookies are not sent. Always scoped to
 * verified courses only; a rejected/pending/nonexistent course returns 404.
 * Does not return videoUrl.
 * Uses a shared (non-private) 'use cache' since the response doesn't depend
 * on the caller's identity.
 */
export async function getPublicCourseDetailsQuery(
  id: string,
): Promise<GetPublicCourseDetailsSuccessResponse> {
  "use cache";
  cacheTag(COURSE_TAGS.publicCourseDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(
      `/courses/${id}/public`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetPublicCourseDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getPublicCourseDetailsQuery failed:", err);
    throw err;
  }
}

/**
 * Admin only. Fetches a paginated, sortable, searchable list of courses created by a specific instructor.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting Admin.
 * Use updateTag(COURSE_TAGS.courses) to invalidate.
 */
export async function getInstructorCoursesQuery(
  id: string,
  params: GetCoursesParams = {},
): Promise<GetInstructorCoursesSuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.courses);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/courses/instructor/${id}${query}`, {
      method: "GET",
    });
    const json: GetInstructorCoursesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getInstructorCoursesQuery failed:", err);
    throw err;
  }
}

/**
 * Admin only. Fetches a paginated, sortable, searchable list of courses a specific student is enrolled in.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting Admin.
 * Use updateTag(COURSE_TAGS.courses) to invalidate.
 */
export async function getStudentCoursesQuery(
  id: string,
  params: GetCoursesParams = {},
): Promise<GetStudentCoursesSuccessResponse> {
  "use cache: private";
  cacheTag(COURSE_TAGS.courses);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/courses/student/${id}${query}`, {
      method: "GET",
    });
    const json: GetStudentCoursesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getStudentCoursesQuery failed:", err);
    throw err;
  }
}
