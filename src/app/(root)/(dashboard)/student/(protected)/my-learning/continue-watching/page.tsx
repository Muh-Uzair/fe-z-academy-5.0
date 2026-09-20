import ContinueWatching from "@/features/student-learning/ContinueWatching";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";
import { getCourseDetailsQuery } from "@/services/course/queries";

type StudentContinueWatchingPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const StudentContinueWatchingPage = async ({
  searchParams,
}: StudentContinueWatchingPageProps) => {
  const { page } = await searchParams;
  const enrollmentsResponse = await getEnrollmentsQuery({
    continueWatching: "true",
    page: page ? Number(page) : 1,
  });

  const courses = await Promise.all(
    enrollmentsResponse.data.enrollments.map(async (enrollment) => ({
      course: (await getCourseDetailsQuery(enrollment.courseDetails._id)).data
        .course,
      enrollment,
    })),
  );

  return (
    <ContinueWatching
      courses={courses}
      pagination={enrollmentsResponse.data.pagination}
    />
  );
};

export default StudentContinueWatchingPage;
