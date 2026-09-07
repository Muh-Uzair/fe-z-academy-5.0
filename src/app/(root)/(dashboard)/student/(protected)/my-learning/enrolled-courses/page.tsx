import EnrolledCourses from "@/features/student-learning/EnrolledCourses";
import { getCoursesQuery } from "@/services/course/queries";

type StudentEnrolledCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const StudentEnrolledCoursesPage = async ({
  searchParams,
}: StudentEnrolledCoursesPageProps) => {
  const { search, page } = await searchParams;

  // No extra filter is sent — the backend already scopes this endpoint to
  // courses the logged-in student is enrolled in (see role-based visibility
  // in courseApiIntegrationGuide.md).
  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <EnrolledCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default StudentEnrolledCoursesPage;
