import InstructorSettings from "@/features/auth-and-user-management/InstructorSettings";
import { getProfileQuery } from "@/services/user/queries";

const InstructorSettingsPage = async () => {
  const response = await getProfileQuery();

  return <InstructorSettings user={response.data.user} />;
};

export default InstructorSettingsPage;
