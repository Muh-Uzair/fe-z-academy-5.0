import { redirect } from "next/navigation";

import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const AdminLayout = async ({ children }: LayoutProps<"/admin">) => {
  const response = (await getMeQuery())!;
  const { user } = response.data;

  // Signed-in users of another role belong in their own workspace.
  if (user.role !== "admin") {
    redirect(`/${user.role}/dashboard`);
  }

  return (
    <AppLayoutShell role="admin" user={user}>
      {children}
    </AppLayoutShell>
  );
};

export default AdminLayout;
