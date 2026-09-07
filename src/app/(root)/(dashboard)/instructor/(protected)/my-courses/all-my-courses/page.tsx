import AllMyCourses from "@/features/course-management/AllMyCourses";
import { getCoursesQuery } from "@/services/course/queries";

type InstructorAllMyCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
  }>;
};

const InstructorAllMyCoursesPage = async ({
  searchParams,
}: InstructorAllMyCoursesPageProps) => {
  const { search, page, status } = await searchParams;

  const normalizedStatus =
    status === "verified" || status === "rejected" || status === "pendingReview"
      ? status
      : undefined;

  // No `instructor` filter is sent — the backend already scopes this
  // endpoint to the logged-in instructor's own courses based on their
  // session (see role-based visibility in courseApiIntegrationGuide.md).
  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
    status: normalizedStatus,
  });

  return (
    <AllMyCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
      status={normalizedStatus ?? "all"}
    />
  );
};

export default InstructorAllMyCoursesPage;

