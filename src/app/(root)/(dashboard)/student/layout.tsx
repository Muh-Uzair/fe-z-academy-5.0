import { redirect } from "next/navigation";

import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const StudentLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const response = (await getMeQuery())!;
  const { user } = response.data;

  // Signed-in users of another role belong in their own workspace.
  if (user.role !== "student") {
    redirect(`/${user.role}/dashboard`);
  }

  return (
    <AppLayoutShell role="student" user={user}>
      {children}
    </AppLayoutShell>
  );
};

export default StudentLayout;
