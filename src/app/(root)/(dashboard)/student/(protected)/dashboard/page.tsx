import StudentDashboard from "@/features/analytics-and-dashboards/StudentDashboard";
import { getStudentDashboardQuery } from "@/services/dashboard/queries";

const StudentDashboardPage = async () => {
  const response = await getStudentDashboardQuery();

  return <StudentDashboard data={response.data} />;
};

export default StudentDashboardPage;
