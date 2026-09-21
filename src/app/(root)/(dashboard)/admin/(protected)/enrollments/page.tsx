import AdminEnrollments from "@/features/financials-and-notifications/AdminEnrollments";
import { getCourseDetailsQuery, getCoursesQuery } from "@/services/course/queries";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";
import {
  getInstructorsQuery,
  getStudentsQuery,
  getUserDetailsQuery,
} from "@/services/user/queries";

type AdminEnrollmentsPageProps = {
  searchParams: Promise<{
    page?: string;
    student?: string;
    studentSearch?: string;
    studentPage?: string;
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

const AdminEnrollmentsPage = async ({
  searchParams,
}: AdminEnrollmentsPageProps) => {
  const {
    page,
    student,
    studentSearch,
    studentPage,
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
    studentsResponse,
    selectedStudentResponse,
    coursesResponse,
    selectedCourseResponse,
    instructorsResponse,
    selectedInstructorResponse,
  ] =
    await Promise.all([
      getEnrollmentsQuery({
        page: page ? Number(page) : 1,
        student,
        course,
        instructor,
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
      getInstructorsQuery({
        search: instructorSearch,
        page: instructorPage ? Number(instructorPage) : 1,
      }),
      instructor ? getUserDetailsQuery(instructor, "instructor") : null,
    ]);

  return (
    <AdminEnrollments
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

export default AdminEnrollmentsPage;
