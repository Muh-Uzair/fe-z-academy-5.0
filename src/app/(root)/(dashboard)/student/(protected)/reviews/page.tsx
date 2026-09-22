import StudentReviews from "@/features/reviews-and-feedback/StudentReviews";
import { getCoursesQuery } from "@/services/course/queries";

type StudentReviewsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const StudentReviewsPage = async ({ searchParams }: StudentReviewsPageProps) => {
  const { search, page } = await searchParams;

  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <StudentReviews
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default StudentReviewsPage;
