import StudentSettings from "@/features/auth-and-user-management/StudentSettings";
import { getProfileQuery } from "@/services/user/queries";

const StudentSettingsPage = async () => {
  const response = await getProfileQuery();

  return <StudentSettings user={response.data.user} />;
};

export default StudentSettingsPage;

