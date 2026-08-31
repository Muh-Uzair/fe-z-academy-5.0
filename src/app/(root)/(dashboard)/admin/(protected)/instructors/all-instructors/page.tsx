import AllInstructors from "@/features/auth-and-user-management/AllInstructors";
import { getInstructorsQuery } from "@/services/user/queries";

type AllInstructorsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    isVerified?: string;
  }>;
};

const AdminAllInstructorsPage = async ({
  searchParams,
}: AllInstructorsPageProps) => {
  const { search, page, isVerified } = await searchParams;

  const normalizedIsVerified =
    isVerified === "true" || isVerified === "false" ? isVerified : undefined;

  const response = await getInstructorsQuery({
    search,
    page: page ? Number(page) : 1,
    isVerified: normalizedIsVerified,
  });

  return (
    <AllInstructors
      instructors={response.data.instructors}
      pagination={response.data.pagination}
      search={search ?? ""}
      isVerified={normalizedIsVerified ?? "all"}
    />
  );
};

export default AdminAllInstructorsPage;
