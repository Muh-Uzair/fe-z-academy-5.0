import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { ENROLLMENT_TAGS } from "./tags";
import type {
  GetEnrollmentsResponse,
  GetEnrollmentDetailsResponse,
} from "@/response-types/enrollmentResponseTypes";

type GetEnrollmentsSuccessResponse = Extract<
  GetEnrollmentsResponse,
  { status: "success" }
>;
type GetEnrollmentDetailsSuccessResponse = Extract<
  GetEnrollmentDetailsResponse,
  { status: "success" }
>;

type GetEnrollmentsParams = {
  student?: string;
  course?: string;
  instructor?: string;
  transaction?: string;
  watchedCompletely?: "true" | "false";
  certificateIssued?: "true" | "false";
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Requires an authenticated session. Visibility is scoped by the caller's
 * role on the backend (no restrictTo gate, no role query param needed):
 * admins see every enrollment, instructors see only enrollments in their
 * own courses, students see only their own enrollments.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 */
export async function getEnrollmentsQuery(
  params: GetEnrollmentsParams = {},
): Promise<GetEnrollmentsSuccessResponse> {
  "use cache: private";
  cacheTag(ENROLLMENT_TAGS.enrollments);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/enrollments${query}`, {
      method: "GET",
    });
    const json: GetEnrollmentsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getEnrollmentsQuery failed:", err);
    throw err;
  }
}

/**
 * Requires an authenticated session. Admin can view any enrollment;
 * instructor/student can only view an enrollment where they are the
 * instructor/student on it (403 otherwise).
 * Uses 'use cache: private' so the cache entry is scoped to the requesting
 * caller, based on the cookies read inside apiClient.
 */
export async function getEnrollmentDetailsQuery(
  id: string,
): Promise<GetEnrollmentDetailsSuccessResponse> {
  "use cache: private";
  cacheTag(ENROLLMENT_TAGS.enrollmentDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/enrollments/${id}`, {
      method: "GET",
    });
    const json: GetEnrollmentDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getEnrollmentDetailsQuery failed:", err);
    throw err;
  }
}
