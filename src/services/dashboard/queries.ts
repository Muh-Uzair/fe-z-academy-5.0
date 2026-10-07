import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { DASHBOARD_TAGS } from "./tags";
import type {
  DashboardPeriod,
  GetAdminDashboardResponse,
  GetInstructorDashboardResponse,
  GetStudentDashboardResponse,
} from "@/response-types/dashboardResponseTypes";

type GetAdminDashboardSuccessResponse = Extract<
  GetAdminDashboardResponse,
  { status: "success" }
>;

type GetInstructorDashboardSuccessResponse = Extract<
  GetInstructorDashboardResponse,
  { status: "success" }
>;

type GetStudentDashboardSuccessResponse = Extract<
  GetStudentDashboardResponse,
  { status: "success" }
>;

/**
 * Admin only. Fetches admin dashboard metrics, trends, top courses, and recent users.
 * Requires accessToken cookie (admin role).
 * 'period' is strictly required: 'week' | 'month' | 'year'.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting admin session.
 */
export async function getAdminDashboardQuery(
  period: DashboardPeriod,
): Promise<GetAdminDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.admin);
  cacheTag(DASHBOARD_TAGS.adminPeriod(period));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/dashboard/admin?period=${period}`, {
      method: "GET",
    });
    const json: GetAdminDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getAdminDashboardQuery failed:", err);
    throw err;
  }
}

/**
 * Instructor only. Fetches instructor dashboard metrics, revenue by course,
 * enrollment trends, course performance, and recent reviews.
 * Requires accessToken cookie (instructor role).
 * 'period' is strictly required: 'week' | 'month' | 'year'.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting instructor session.
 */
export async function getInstructorDashboardQuery(
  period: DashboardPeriod,
): Promise<GetInstructorDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.instructor);
  cacheTag(DASHBOARD_TAGS.instructorPeriod(period));
  cacheLife("minutes");

  try {
    const res = await apiClient(`/dashboard/instructor?period=${period}`, {
      method: "GET",
    });
    const json: GetInstructorDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getInstructorDashboardQuery failed:", err);
    throw err;
  }
}

/**
 * Student only. Fetches student dashboard learning metrics, resume watching items,
 * recent transactions, and recent reviews.
 * Requires accessToken cookie (student role).
 * No query parameters are accepted.
 * Uses 'use cache: private' so the cache entry is scoped to the requesting student session.
 */
export async function getStudentDashboardQuery(): Promise<GetStudentDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.student);
  cacheLife("minutes");

  try {
    const res = await apiClient(`/dashboard/student`, {
      method: "GET",
    });
    const json: GetStudentDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getStudentDashboardQuery failed:", err);
    throw err;
  }
}
