import ViewCourseReviews from "@/features/reviews-and-feedback/ViewCourseReviews";
import { getCourseDetailsQuery } from "@/services/course/queries";
import {
  getReviewsByCourseIdQuery,
  getReviewByCourseIdAsStudentQuery,
} from "@/services/review/queries";
import { getMeQuery } from "@/services/auth/queries";
import type { Review } from "@/response-types/reviewResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";

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

  const [courseResponse, meResponse] = await Promise.all([
    getCourseDetailsQuery(id),
    getMeQuery(),
  ]);

  const role = meResponse.data.user.role;

  let reviews: Review[] = [];
  let pagination: Pagination | null = null;
  let studentReview: Review | null = null;
  let isEnrolled = false;

  if (role === "student") {
    try {
      const studentReviewResponse = await getReviewByCourseIdAsStudentQuery(id);
      studentReview = studentReviewResponse.data.review;
    } catch {
      studentReview = null;
    }

    try {
      const enrollmentsResponse = await getEnrollmentsQuery({
        course: id,
        limit: 1,
      });
      if (enrollmentsResponse.data.enrollments.length > 0) {
        isEnrolled = true;
      }
    } catch {
      isEnrolled = false;
    }
  } else {
    const reviewsResponse = await getReviewsByCourseIdQuery(id, {
      page: page ? Number(page) : 1,
    });
    reviews = reviewsResponse.data.reviews;
    pagination = reviewsResponse.data.pagination;
  }

  return (
    <ViewCourseReviews
      course={courseResponse.data.course}
      reviews={reviews}
      pagination={pagination}
      role={role}
      studentReview={studentReview}
      isEnrolled={isEnrolled}
    />
  );
};

export default ViewCourseReviewsPage;
