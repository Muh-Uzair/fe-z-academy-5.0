import AppLayoutShell from "@/components/AppLayoutShell";

const AdminLayout = ({ children }: LayoutProps<"/admin">) => {
  return <AppLayoutShell role="admin">{children}</AppLayoutShell>;
};

export default AdminLayout;
