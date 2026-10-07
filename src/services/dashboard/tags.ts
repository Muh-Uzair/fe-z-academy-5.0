import type { DashboardPeriod } from "@/response-types/dashboardResponseTypes";

export const DASHBOARD_TAGS = {
  admin: "dashboard-admin",
  adminPeriod: (period: DashboardPeriod) => `dashboard-admin-${period}`,
  instructor: "dashboard-instructor",
  instructorPeriod: (period: DashboardPeriod) => `dashboard-instructor-${period}`,
  student: "dashboard-student",
} as const;
