import InstructorReviews from "@/features/reviews-and-feedback/InstructorReviews";
import { getCoursesQuery } from "@/services/course/queries";

type InstructorReviewsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const InstructorReviewsPage = async ({
  searchParams,
}: InstructorReviewsPageProps) => {
  const { search, page } = await searchParams;

  const response = await getCoursesQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <InstructorReviews
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default InstructorReviewsPage;
