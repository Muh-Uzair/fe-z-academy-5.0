import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { USER_TAGS } from "./tags";
import type {
  GetInstructorsResponse,
  GetUserDetailsResponse,
  GetInstructorOnboardingLinkResponse,
} from "@/response-types/userResponseTypes";

// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetInstructorsSuccessResponse = Extract<
  GetInstructorsResponse,
  { status: "success" }
>;
type GetUserDetailsSuccessResponse = Extract<
  GetUserDetailsResponse,
  { status: "success" }
>;
type GetInstructorOnboardingLinkSuccessResponse = Extract<
  GetInstructorOnboardingLinkResponse,
  { status: "success" }
>;

type GetInstructorsParams = {
  isVerified?: "true" | "false";
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Admin only. Fetches a paginated, filterable, searchable list of
 * instructor accounts.
 * Use updateTag(USER_TAGS.instructors) to invalidate this after a
 * verification update.
 */
export async function getInstructorsQuery(
  params: GetInstructorsParams = {},
): Promise<GetInstructorsSuccessResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.instructors);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/users/instructors${query}`, {
      method: "GET",
    });
    const json: GetInstructorsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    throw err;
  }
}

/**
 * Admin only. Fetches a single user's public fields, scoped to an
 * expected role.
 * Use updateTag(USER_TAGS.userDetails(id)) to invalidate this after a
 * verification update.
 */
export async function getUserDetailsQuery(
  id: string,
  role?: "student" | "instructor" | "admin",
): Promise<GetUserDetailsSuccessResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.userDetails(id));
  cacheLife("minutes");

  const query = buildQueryString({ role });

  try {
    const res = await apiClient(`/users/user/${id}${query}`, {
      method: "GET",
    });
    const json: GetUserDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getUserDetailsQuery failed:", err);
    throw err;
  }
}

/**
 * Instructor only. Returns a fresh Stripe Express onboarding URL.
 * Intentionally NOT cached — the link is single-use/short-lived per
 * Stripe's rules, a new one must be requested every time.
 */
export async function getInstructorOnboardingLinkQuery(): Promise<GetInstructorOnboardingLinkSuccessResponse> {
  try {
    const res = await apiClient("/users/get-instructor-onboarding-link", {
      method: "GET",
    });
    const json: GetInstructorOnboardingLinkResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getInstructorOnboardingLinkQuery failed:", err);
    throw err;
  }
}
