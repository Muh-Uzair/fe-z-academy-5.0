import PendingVerifications from "@/features/auth-and-user-management/PendingVerifications";
import { getInstructorsQuery } from "@/services/user/queries";

type PendingVerificationsPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const AdminPendingVerificationsPage = async ({
  searchParams,
}: PendingVerificationsPageProps) => {
  const { search, page } = await searchParams;

  const response = await getInstructorsQuery({
    isVerified: "false",
    search,
    page: page ? Number(page) : 1,
  });

  const instructors =
    response.status === "success" ? response.data.instructors : [];
  const pagination =
    response.status === "success" ? response.data.pagination : null;

  return (
    <PendingVerifications
      instructors={instructors}
      pagination={pagination}
      search={search ?? ""}
    />
  );
};

export default AdminPendingVerificationsPage;

