import AppLayoutShell from "@/components/AppLayoutShell";

const StudentLayout = ({ children }: LayoutProps<"/student">) => {
  return <AppLayoutShell role="student">{children}</AppLayoutShell>;
};

export default StudentLayout;
