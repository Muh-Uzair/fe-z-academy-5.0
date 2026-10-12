import { redirect } from "next/navigation";

import CourseCheckout from "@/features/student-learning/CourseCheckout";
import {
  getPublicCourseDetailsQuery,
  getPublicCoursesQuery,
} from "@/services/course/queries";
import { getSavedCardsQuery } from "@/services/cards/queries";
import { getMeQuery } from "@/services/auth/queries";
import type { SavedCard } from "@/response-types/cardResponseTypes";

type CourseCheckoutPageProps = {
  params: Promise<{ id: string }>;
};

const CourseCheckoutPage = async ({ params }: CourseCheckoutPageProps) => {
  const { id } = await params;

  // Only signed-in students can buy a course. getMeQuery() redirects to
  // /signin when there is no valid session; other roles go to their dashboard.
  const { role } = (await getMeQuery())!.data.user;

  if (role !== "student") {
    redirect(`/${role}/dashboard`);
  }

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

