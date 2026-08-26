import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const StudentLayout = async ({ children }: LayoutProps<"/student">) => {
  await getMeQuery();

  return <AppLayoutShell role="student">{children}</AppLayoutShell>;
};

export default StudentLayout;
