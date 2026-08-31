import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { USER_TAGS } from "./tags";
import type {
  GetInstructorsResponse,
  GetUserDetailsResponse,
  GetInstructorOnboardingLinkResponse,
} from "@/response-types/userResponseTypes";

type GetInstructorsParams = {
  isVerified?: "true" | "false";
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function buildQueryString(
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Admin only. Fetches a paginated, filterable, searchable list of
 * instructor accounts.
 * Use updateTag(USER_TAGS.instructors) to invalidate this after a
 * verification update.
 */
export async function getInstructorsQuery(
  params: GetInstructorsParams = {},
): Promise<GetInstructorsResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.instructors);
  cacheLife("minutes");

  const query = buildQueryString(params);
  const res = await apiClient(`/users/instructors${query}`, {
    method: "GET",
  });

  return res.json();
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
): Promise<GetUserDetailsResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.userDetails(id));
  cacheLife("minutes");

  const query = buildQueryString({ role });
  const res = await apiClient(`/users/user/${id}${query}`, {
    method: "GET",
  });

  return res.json();
}

/**
 * Instructor only. Returns a fresh Stripe Express onboarding URL.
 * Intentionally NOT cached — the link is single-use/short-lived per
 * Stripe's rules, a new one must be requested every time.
 */
export async function getInstructorOnboardingLinkQuery(): Promise<GetInstructorOnboardingLinkResponse> {
  const res = await apiClient("/users/get-instructor-onboarding-link", {
    method: "GET",
  });

  return res.json();
}
