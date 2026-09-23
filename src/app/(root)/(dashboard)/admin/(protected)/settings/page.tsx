import AdminSettings from "@/features/auth-and-user-management/AdminSettings";
import { getProfileQuery } from "@/services/user/queries";

const AdminSettingsPage = async () => {
  const response = await getProfileQuery();

  return <AdminSettings user={response.data.user} />;
};

export default AdminSettingsPage;

