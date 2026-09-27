import AdminDashboard from "@/features/analytics-and-dashboards/AdminDashboard";
import { getAdminDashboardQuery } from "@/services/dashboard/queries";

type AdminDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const AdminDashboardPage = async ({ searchParams }: AdminDashboardPageProps) => {
  const { period } = await searchParams;

  const normalizedPeriod =
    period === "week" || period === "month" || period === "year"
      ? period
      : "month";

  const response = await getAdminDashboardQuery(normalizedPeriod);

  return (
    <AdminDashboard
      data={response.data}
      period={normalizedPeriod}
    />
  );
};

export default AdminDashboardPage;
