import { redirect } from "next/navigation";

import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const InstructorLayout = async ({ children }: LayoutProps<"/instructor">) => {
  const response = (await getMeQuery())!;
  const { user } = response.data;

  // Signed-in users of another role belong in their own workspace.
  if (user.role !== "instructor") {
    redirect(`/${user.role}/dashboard`);
  }

  return (
    <AppLayoutShell role="instructor" user={user}>
      {children}
    </AppLayoutShell>
  );
};

export default InstructorLayout;
