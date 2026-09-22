import ViewCourseReviews from "@/features/reviews-and-feedback/ViewCourseReviews";
import { getCourseDetailsQuery } from "@/services/course/queries";
import { getReviewsByCourseIdQuery } from "@/services/review/queries";
import { getMeQuery } from "@/services/auth/queries";

type ViewCourseReviewsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

const ViewCourseReviewsPage = async ({
  params,
  searchParams,
}: ViewCourseReviewsPageProps) => {
  const { id } = await params;
  const { page } = await searchParams;

  const [courseResponse, reviewsResponse, meResponse] = await Promise.all([
    getCourseDetailsQuery(id),
    getReviewsByCourseIdQuery(id, { page: page ? Number(page) : 1 }),
    getMeQuery(),
  ]);

  return (
    <ViewCourseReviews
      course={courseResponse.data.course}
      reviews={reviewsResponse.data.reviews}
      pagination={reviewsResponse.data.pagination}
      role={meResponse.data.user.role}
    />
  );
};

export default ViewCourseReviewsPage;
