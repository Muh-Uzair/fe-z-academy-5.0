import CourseCheckout from "@/features/student-learning/CourseCheckout";
import {
  getPublicCourseDetailsQuery,
  getPublicCoursesQuery,
} from "@/services/course/queries";

type CourseCheckoutPageProps = {
  params: Promise<{ id: string }>;
};

const CourseCheckoutPage = async ({ params }: CourseCheckoutPageProps) => {
  const { id } = await params;

  const courseResponse = await getPublicCourseDetailsQuery(id);
  const course = courseResponse.data.course;

  const similarCoursesResponse = await getPublicCoursesQuery({
    category: course.categoryDetails._id,
    limit: 9,
  });

  const similarCourses = similarCoursesResponse.data.courses.filter(
    (similarCourse) => similarCourse._id !== course._id,
  );

  return <CourseCheckout course={course} similarCourses={similarCourses} />;
};

export default CourseCheckoutPage;
