import InstructorDashboard from "@/features/analytics-and-dashboards/InstructorDashboard";
import { getInstructorDashboardQuery } from "@/services/dashboard/queries";
import type { DashboardPeriod } from "@/response-types/dashboardResponseTypes";

type InstructorDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const InstructorDashboardPage = async ({
  searchParams,
}: InstructorDashboardPageProps) => {
  const { period } = await searchParams;

  const validPeriod: DashboardPeriod =
    period === "week" || period === "month" || period === "year"
      ? period
      : "month";

  const response = await getInstructorDashboardQuery(validPeriod);

  return (
    <InstructorDashboard
      data={response.data}
      period={validPeriod}
    />
  );
};

export default InstructorDashboardPage;
