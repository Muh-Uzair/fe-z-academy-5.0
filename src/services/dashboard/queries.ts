import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { DASHBOARD_TAGS } from "./tags";
import type {
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

export async function getAdminDashboardQuery(
  period: "week" | "month" | "year"
): Promise<GetAdminDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.admin);
  cacheLife("minutes");

  const query = buildQueryString({ period });

  try {
    const res = await apiClient(`/dashboard/admin${query}`, {
      method: "GET",
    });
    const json: GetAdminDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    throw err;
  }
}

export async function getInstructorDashboardQuery(
  period: "week" | "month" | "year"
): Promise<GetInstructorDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.instructor);
  cacheLife("minutes");

  const query = buildQueryString({ period });

  try {
    const res = await apiClient(`/dashboard/instructor${query}`, {
      method: "GET",
    });
    const json: GetInstructorDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    throw err;
  }
}

export async function getStudentDashboardQuery(
  period: "week" | "month" | "year"
): Promise<GetStudentDashboardSuccessResponse> {
  "use cache: private";
  cacheTag(DASHBOARD_TAGS.student);
  cacheLife("minutes");

  const query = buildQueryString({ period });

  try {
    const res = await apiClient(`/dashboard/student${query}`, {
      method: "GET",
    });
    const json: GetStudentDashboardResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    throw err;
  }
}
