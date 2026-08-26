import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const StudentLayout = async ({ children }: LayoutProps<"/student">) => {
  const response = await getMeQuery();

  return (
    <AppLayoutShell role="student" user={response.data.user}>
      {children}
    </AppLayoutShell>
  );
};

export default StudentLayout;
