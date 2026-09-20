import InstructorSettings from "@/features/auth-and-user-management/InstructorSettings";
import { getMeQuery } from "@/services/auth/queries";

const InstructorSettingsPage = async () => {
  const response = await getMeQuery();

  return <InstructorSettings user={response.data.user} />;
};

export default InstructorSettingsPage;
