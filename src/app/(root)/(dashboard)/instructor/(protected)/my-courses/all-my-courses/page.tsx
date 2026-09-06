import AllMyCourses from "@/features/course-management/AllMyCourses";
import { getCoursesQuery } from "@/services/course/queries";

type InstructorAllMyCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    isVerified?: string;
  }>;
};

const InstructorAllMyCoursesPage = async ({
  searchParams,
}: InstructorAllMyCoursesPageProps) => {
  const { search, page, isVerified } = await searchParams;

  const normalizedIsVerified =
    isVerified === "true" || isVerified === "false" ? isVerified : undefined;

  // No `instructor` filter is sent — the backend already scopes this
  // endpoint to the logged-in instructor's own courses based on their
  // session (see role-based visibility in courseApiIntegrationGuide.md).
  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
    isVerified: normalizedIsVerified,
  });

  return (
    <AllMyCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
      isVerified={normalizedIsVerified ?? "all"}
    />
  );
};

export default InstructorAllMyCoursesPage;

