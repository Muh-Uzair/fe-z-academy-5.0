import TransactionsTable from "@/features/transaction-management/TransactionsTable";
import { getTransactionsQuery } from "@/services/transaction/queries";
import {
  getInstructorsQuery,
  getStudentsQuery,
  getUserDetailsQuery,
} from "@/services/user/queries";
import { getCoursesQuery, getCourseDetailsQuery } from "@/services/course/queries";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type AdminTransactionsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    paymentStatus?: string;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: string;
    course?: string;
    courseSearch?: string;
    coursePage?: string;
    student?: string;
    studentSearch?: string;
    studentPage?: string;
  }>;
};

const PAYMENT_STATUSES: Transaction["paymentStatus"][] = [
  "pending",
  "paid",
  "failed",
  "refund_processing",
  "refunded",
];

const AdminTransactionsPage = async ({
  searchParams,
}: AdminTransactionsPageProps) => {
  const {
    search,
    page,
    paymentStatus,
    instructor,
    instructorSearch,
    instructorPage,
    course,
    courseSearch,
    coursePage,
    student,
    studentSearch,
    studentPage,
  } = await searchParams;

  const normalizedPaymentStatus = PAYMENT_STATUSES.includes(
    paymentStatus as Transaction["paymentStatus"],
  )
    ? (paymentStatus as Transaction["paymentStatus"])
    : undefined;

  const [
    response,
    instructorsResponse,
    selectedInstructorResponse,
    coursesResponse,
    selectedCourseResponse,
    studentsResponse,
    selectedStudentResponse,
  ] = await Promise.all([
    getTransactionsQuery({
      search,
      page: page ? Number(page) : 1,
      paymentStatus: normalizedPaymentStatus,
      instructor,
      course,
      student,
    }),
    getInstructorsQuery({
      search: instructorSearch,
      page: instructorPage ? Number(instructorPage) : 1,
    }),
    // Resolve the selected instructor's name so the picker can show it as
    // the trigger label even when it isn't on the current results page.
    instructor ? getUserDetailsQuery(instructor, "instructor") : null,
    // Admin sees all courses (verified/unverified), so use the private
    // getCoursesQuery rather than the public-only course listing.
    getCoursesQuery({
      search: courseSearch,
      page: coursePage ? Number(coursePage) : 1,
    }),
    // Resolve the selected course's title so the picker can show it as the
    // trigger label even when it isn't on the current results page.
    course ? getCourseDetailsQuery(course) : null,
    getStudentsQuery({
      search: studentSearch,
      page: studentPage ? Number(studentPage) : 1,
    }),
    // Resolve the selected student's name so the picker can show it as the
    // trigger label even when it isn't on the current results page.
    student ? getUserDetailsQuery(student, "student") : null,
  ]);

  return (
    <TransactionsTable
      basePath="/admin/transactions"
      transactions={response.data.transactions}
      pagination={response.data.pagination}
      search={search ?? ""}
      paymentStatus={normalizedPaymentStatus ?? "all"}
      instructorFilter={{
        instructors: instructorsResponse.data.instructors,
        instructorsPagination: instructorsResponse.data.pagination,
        instructorSearch: instructorSearch ?? "",
        instructor: instructor ?? "",
        selectedInstructorLabel:
          selectedInstructorResponse?.data.user.fullName ?? null,
      }}
      courseFilter={{
        courses: coursesResponse.data.courses,
        coursesPagination: coursesResponse.data.pagination,
        courseSearch: courseSearch ?? "",
        course: course ?? "",
        selectedCourseLabel: selectedCourseResponse?.data.course.title ?? null,
      }}
      studentFilter={{
        students: studentsResponse.data.students,
        studentsPagination: studentsResponse.data.pagination,
        studentSearch: studentSearch ?? "",
        student: student ?? "",
        selectedStudentLabel:
          selectedStudentResponse?.data.user.fullName ?? null,
      }}
    />
  );
};

export default AdminTransactionsPage;
