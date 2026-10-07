import AdminDashboard from "@/features/analytics-and-dashboards/AdminDashboard";
import { getAdminDashboardQuery } from "@/services/dashboard/queries";
import type { DashboardPeriod } from "@/response-types/dashboardResponseTypes";

type AdminDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const AdminDashboardPage = async ({
  searchParams,
}: AdminDashboardPageProps) => {
  const { period } = await searchParams;

  const validPeriod: DashboardPeriod =
    period === "week" || period === "month" || period === "year"
      ? period
      : "month";

  const response = await getAdminDashboardQuery(validPeriod);

  return (
    <AdminDashboard
      data={response.data}
      period={validPeriod}
    />
  );
};

export default AdminDashboardPage;
