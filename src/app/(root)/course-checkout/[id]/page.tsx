import CourseCheckout from "@/features/student-learning/CourseCheckout";
import {
  getPublicCourseDetailsQuery,
  getPublicCoursesQuery,
} from "@/services/course/queries";
import { getSavedCardsQuery } from "@/services/cards/queries";
import type { SavedCard } from "@/response-types/cardResponseTypes";

type CourseCheckoutPageProps = {
  params: Promise<{ id: string }>;
};

const CourseCheckoutPage = async ({ params }: CourseCheckoutPageProps) => {
  const { id } = await params;

  const [courseResponse, savedCardsResponse] = await Promise.all([
    getPublicCourseDetailsQuery(id),
    getSavedCardsQuery().catch(() => null),
  ]);

  const course = courseResponse.data.course;

  const similarCoursesResponse = await getPublicCoursesQuery({
    category: course.categoryDetails._id,
    limit: 9,
  });

  const similarCourses = similarCoursesResponse.data.courses.filter(
    (similarCourse) => similarCourse._id !== course._id,
  );

  const savedCards: SavedCard[] = savedCardsResponse?.data.cards ?? [];

  return (
    <CourseCheckout
      course={course}
      similarCourses={similarCourses}
      savedCards={savedCards}
    />
  );
};

export default CourseCheckoutPage;

