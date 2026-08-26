import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const InstructorLayout = async ({ children }: LayoutProps<"/instructor">) => {
  const response = await getMeQuery();

  return (
    <AppLayoutShell role="instructor" user={response.data.user}>
      {children}
    </AppLayoutShell>
  );
};

export default InstructorLayout;
