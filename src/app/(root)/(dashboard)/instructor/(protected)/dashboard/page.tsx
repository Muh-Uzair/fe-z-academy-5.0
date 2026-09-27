import InstructorDashboard from "@/features/analytics-and-dashboards/InstructorDashboard";
import { getInstructorDashboardQuery } from "@/services/dashboard/queries";

type InstructorDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const InstructorDashboardPage = async ({
  searchParams,
}: InstructorDashboardPageProps) => {
  const { period } = await searchParams;

  const normalizedPeriod =
    period === "week" || period === "month" || period === "year"
      ? period
      : "month";

  const response = await getInstructorDashboardQuery(normalizedPeriod);

  return (
    <InstructorDashboard
      data={response.data}
      period={normalizedPeriod}
    />
  );
};

export default InstructorDashboardPage;
