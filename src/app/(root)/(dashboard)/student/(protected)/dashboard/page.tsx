import StudentDashboard from "@/features/analytics-and-dashboards/StudentDashboard";
import { getStudentDashboardQuery } from "@/services/dashboard/queries";

type StudentDashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

const StudentDashboardPage = async ({
  searchParams,
}: StudentDashboardPageProps) => {
  const { period } = await searchParams;

  const normalizedPeriod =
    period === "week" || period === "month" || period === "year"
      ? period
      : "month";

  const response = await getStudentDashboardQuery(normalizedPeriod);

  return (
    <StudentDashboard
      data={response.data}
      period={normalizedPeriod}
    />
  );
};

export default StudentDashboardPage;
