import InstructorEnrollments from "@/features/financials-and-notifications/InstructorEnrollments";
import { getCourseDetailsQuery, getCoursesQuery } from "@/services/course/queries";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";
import { getStudentsQuery, getUserDetailsQuery } from "@/services/user/queries";

type InstructorEnrollmentsPageProps = {
  searchParams: Promise<{
    page?: string;
    student?: string;
    studentSearch?: string;
    studentPage?: string;
    course?: string;
    courseSearch?: string;
    coursePage?: string;
    watchedCompletely?: string;
    certificateIssued?: string;
  }>;
};

const InstructorEnrollmentsPage = async ({
  searchParams,
}: InstructorEnrollmentsPageProps) => {
  const {
    page,
    student,
    studentSearch,
    studentPage,
    course,
    courseSearch,
    coursePage,
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
    studentsResponse,
    selectedStudentResponse,
    coursesResponse,
    selectedCourseResponse,
  ] =
    await Promise.all([
      getEnrollmentsQuery({
        page: page ? Number(page) : 1,
        student,
        course,
        watchedCompletely: normalizedWatchedCompletely,
        certificateIssued: normalizedCertificateIssued,
      }),
      getStudentsQuery({
        search: studentSearch,
        page: studentPage ? Number(studentPage) : 1,
      }),
      student ? getUserDetailsQuery(student, "student") : null,
      getCoursesQuery({
        search: courseSearch,
        page: coursePage ? Number(coursePage) : 1,
      }),
      course ? getCourseDetailsQuery(course) : null,
    ]);

  return (
    <InstructorEnrollments
      enrollments={response.data.enrollments}
      pagination={response.data.pagination}
      studentFilter={{
        students: studentsResponse.data.students,
        studentsPagination: studentsResponse.data.pagination,
        studentSearch: studentSearch ?? "",
        student: student ?? "",
        selectedStudentLabel:
          selectedStudentResponse?.data.user.fullName ?? null,
      }}
      courseFilter={{
        courses: coursesResponse.data.courses,
        coursesPagination: coursesResponse.data.pagination,
        courseSearch: courseSearch ?? "",
        course: course ?? "",
        selectedCourseLabel: selectedCourseResponse?.data.course.title ?? null,
      }}
      watchedCompletely={normalizedWatchedCompletely ?? "all"}
      certificateIssued={normalizedCertificateIssued ?? "all"}
    />
  );
};

export default InstructorEnrollmentsPage;
