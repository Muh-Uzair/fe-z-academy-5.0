import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  const response = await getMeQuery();

  return (
    <AppLayoutShell role="admin" user={response.data.user}>
      {children}
    </AppLayoutShell>
  );
};

export default AdminLayout;
