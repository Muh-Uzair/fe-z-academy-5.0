import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { USER_TAGS } from "./tags";
import type {
  GetInstructorsResponse,
  GetStudentsResponse,
  GetUserDetailsResponse,
  GetProfileResponse,
} from "@/response-types/userResponseTypes";

// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetInstructorsSuccessResponse = Extract<
  GetInstructorsResponse,
  { status: "success" }
>;
type GetStudentsSuccessResponse = Extract<
  GetStudentsResponse,
  { status: "success" }
>;
type GetUserDetailsSuccessResponse = Extract<
  GetUserDetailsResponse,
  { status: "success" }
>;
type GetProfileSuccessResponse = Extract<
  GetProfileResponse,
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
 * Admin or Student. Fetches a paginated, filterable, searchable list of
 * instructor accounts, scoped by the caller's role: an admin sees every
 * instructor, a student sees only instructors whose course they've bought.
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

type GetStudentsParams = {
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Admin or Instructor. Fetches a paginated, searchable list of student
 * accounts, scoped by the caller's role: an admin sees every student, an
 * instructor sees only students enrolled in at least one of their own
 * courses.
 */
export async function getStudentsQuery(
  params: GetStudentsParams = {},
): Promise<GetStudentsSuccessResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.students);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(`/users/students${query}`, {
      method: "GET",
    });
    const json: GetStudentsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getStudentsQuery failed:", err);
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
 * Any authenticated user. Fetches the signed-in user's own profile details.
 * Use updateTag(USER_TAGS.profile) to invalidate this after an update.
 */
export async function getProfileQuery(): Promise<GetProfileSuccessResponse> {
  "use cache: private";
  cacheTag(USER_TAGS.profile);
  cacheLife("minutes");

  try {
    const res = await apiClient(`/users/profile`, {
      method: "GET",
    });
    const json: GetProfileResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getProfileQuery failed:", err);
    throw err;
  }
}
