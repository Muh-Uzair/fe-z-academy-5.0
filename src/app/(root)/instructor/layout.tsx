import AppLayoutShell from "@/components/AppLayoutShell";
import { getMeQuery } from "@/services/auth/queries";

const InstructorLayout = async ({ children }: LayoutProps<"/instructor">) => {
  await getMeQuery();

  return <AppLayoutShell role="instructor">{children}</AppLayoutShell>;
};

export default InstructorLayout;
