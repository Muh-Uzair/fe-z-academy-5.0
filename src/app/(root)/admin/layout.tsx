import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  await getMeQuery();

  return <AppLayoutShell role="admin">{children}</AppLayoutShell>;
};

export default AdminLayout;
