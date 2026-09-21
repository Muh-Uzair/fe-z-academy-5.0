import StudentEnrollments from "@/features/student-learning/StudentEnrollments";
import { getCourseDetailsQuery, getCoursesQuery } from "@/services/course/queries";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";

type StudentEnrollmentsPageProps = {
  searchParams: Promise<{
    page?: string;
    course?: string;
    courseSearch?: string;
    coursePage?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
    watchedCompletely?: string;
    certificateIssued?: string;
  }>;
};

const StudentEnrollmentsPage = async ({
  searchParams,
}: StudentEnrollmentsPageProps) => {
  const {
    page,
    course,
    courseSearch,
    coursePage,
    instructor,
    instructorSearch,
    instructorPage,
    watchedCompletely,
    certificateIssued,
  } = await searchParams;
  const normalizedWatchedCompletely =
    watchedCompletely === "true" || watchedCompletely === "false"
      ? watchedCompletely
      : undefined;
  const normalizedCertificateIssued =
    certificateIssued === "true" || certificateIssued === "false"
      ? certificateIssued
      : undefined;
  const [
    response,
    coursesResponse,
    selectedCourseResponse,
    instructorsResponse,
    selectedInstructorResponse,
  ] = await Promise.all([
    getEnrollmentsQuery({
      page: page ? Number(page) : 1,
      course,
      instructor,
      watchedCompletely: normalizedWatchedCompletely,
      certificateIssued: normalizedCertificateIssued,
    }),
    getCoursesQuery({
      search: courseSearch,
      page: coursePage ? Number(coursePage) : 1,
    }),
    course ? getCourseDetailsQuery(course) : null,
    getInstructorsQuery({
      search: instructorSearch,
      page: instructorPage ? Number(instructorPage) : 1,
    }),
    instructor ? getUserDetailsQuery(instructor, "instructor") : null,
  ]);

  return (
    <StudentEnrollments
      enrollments={response.data.enrollments}
      pagination={response.data.pagination}
      courseFilter={{
        courses: coursesResponse.data.courses,
        coursesPagination: coursesResponse.data.pagination,
        courseSearch: courseSearch ?? "",
        course: course ?? "",
        selectedCourseLabel: selectedCourseResponse?.data.course.title ?? null,
      }}
      instructorFilter={{
        instructors: instructorsResponse.data.instructors,
        instructorsPagination: instructorsResponse.data.pagination,
        instructorSearch: instructorSearch ?? "",
        instructor: instructor ?? "",
        selectedInstructorLabel:
          selectedInstructorResponse?.data.user.fullName ?? null,
      }}
      watchedCompletely={normalizedWatchedCompletely ?? "all"}
      certificateIssued={normalizedCertificateIssued ?? "all"}
    />
  );
};

export default StudentEnrollmentsPage;
