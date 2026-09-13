import EnrolledCourses from "@/features/student-learning/EnrolledCourses";
import { getCoursesQuery } from "@/services/course/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";

type StudentEnrolledCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
  }>;
};

const StudentEnrolledCoursesPage = async ({
  searchParams,
}: StudentEnrolledCoursesPageProps) => {
  const { search, page, instructor, instructorSearch, instructorPage } =
    await searchParams;

  // The backend already scopes this endpoint to courses the logged-in
  // student is enrolled in (see role-based visibility in
  // courseApiIntegrationGuide.md) — instructor here just narrows within that.
  const [response, instructorsResponse, selectedInstructorResponse] =
    await Promise.all([
      getCoursesQuery({
        search,
        page: page ? Number(page) : 1,
        instructor,
      }),
      getInstructorsQuery({
        search: instructorSearch,
        page: instructorPage ? Number(instructorPage) : 1,
      }),
      // Resolve the selected instructor's name so the picker can show it as
      // the trigger label even when it isn't on the current results page.
      instructor ? getUserDetailsQuery(instructor, "instructor") : null,
    ]);

  return (
    <EnrolledCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
      instructors={instructorsResponse.data.instructors}
      instructorsPagination={instructorsResponse.data.pagination}
      instructorSearch={instructorSearch ?? ""}
      instructor={instructor ?? ""}
      selectedInstructorLabel={
        selectedInstructorResponse?.data.user.fullName ?? null
      }
    />
  );
};

export default StudentEnrolledCoursesPage;
