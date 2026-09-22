import AdminReviews from "@/features/reviews-and-feedback/AdminReviews";
import { getCoursesQuery } from "@/services/course/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";

type AdminReviewsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
  }>;
};

const AdminReviewsPage = async ({ searchParams }: AdminReviewsPageProps) => {
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
      instructor ? getUserDetailsQuery(instructor, "instructor") : null,
    ]);

  return (
    <AdminReviews
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

export default AdminReviewsPage;
