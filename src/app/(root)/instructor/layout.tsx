import AppLayoutShell from "@/components/AppLayoutShell";

const InstructorLayout = ({ children }: LayoutProps<"/instructor">) => {
  return <AppLayoutShell role="instructor">{children}</AppLayoutShell>;
};

export default InstructorLayout;
