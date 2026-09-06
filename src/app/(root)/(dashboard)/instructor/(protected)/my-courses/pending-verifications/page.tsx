import PendingVerifications from "@/features/course-management/PendingVerifications";
import { getCoursesQuery } from "@/services/course/queries";

type InstructorPendingVerificationsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const InstructorPendingVerificationsPage = async ({
  searchParams,
}: InstructorPendingVerificationsPageProps) => {
  const { search, page } = await searchParams;

  // No `instructor` filter is sent — the backend already scopes this
  // endpoint to the logged-in instructor's own courses based on their
  // session (see role-based visibility in courseApiIntegrationGuide.md).
  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
    isVerified: "false",
  });

  return (
    <PendingVerifications
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default InstructorPendingVerificationsPage;

