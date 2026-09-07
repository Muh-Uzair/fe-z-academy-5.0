import VerifiedCourses from "@/features/course-management/VerifiedCourses";
import { getCoursesQuery } from "@/services/course/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";

type AdminVerifiedCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
  }>;
};

const AdminVerifiedCoursesPage = async ({
  searchParams,
}: AdminVerifiedCoursesPageProps) => {
  const { search, page, instructor, instructorSearch, instructorPage } =
    await searchParams;

  const [response, instructorsResponse, selectedInstructorResponse] =
    await Promise.all([
      getCoursesQuery({
        search,
        page: page ? Number(page) : 1,
        status: "verified",
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
    <VerifiedCourses
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

export default AdminVerifiedCoursesPage;

