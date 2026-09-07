import AllCourses from "@/features/course-management/AllCourses";
import { getCoursesQuery } from "@/services/course/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";

type AdminAllCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
  }>;
};

const AdminAllCoursesPage = async ({
  searchParams,
}: AdminAllCoursesPageProps) => {
  const {
    search,
    page,
    status,
    instructor,
    instructorSearch,
    instructorPage,
  } = await searchParams;

  const normalizedStatus =
    status === "verified" || status === "rejected" || status === "pendingReview"
      ? status
      : undefined;

  const [response, instructorsResponse, selectedInstructorResponse] =
    await Promise.all([
      getCoursesQuery({
        search,
        page: page ? Number(page) : 1,
        status: normalizedStatus,
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
    <AllCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
      status={normalizedStatus ?? "all"}
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

export default AdminAllCoursesPage;

