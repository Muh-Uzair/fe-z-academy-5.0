import TransactionsTable from "@/features/transaction-management/TransactionsTable";
import { getTransactionsQuery } from "@/services/transaction/queries";
import { getStudentsQuery } from "@/services/user/queries";
import { getCoursesQuery, getCourseDetailsQuery } from "@/services/course/queries";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type InstructorTransactionsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    paymentStatus?: string;
    student?: string;
    studentSearch?: string;
    studentPage?: string;
    course?: string;
    courseSearch?: string;
    coursePage?: string;
  }>;
};

const PAYMENT_STATUSES: Transaction["paymentStatus"][] = [
  "pending",
  "paid",
  "failed",
  "refund_processing",
  "refunded",
];

const InstructorTransactionsPage = async ({
  searchParams,
}: InstructorTransactionsPageProps) => {
  const {
    search,
    page,
    paymentStatus,
    student,
    studentSearch,
    studentPage,
    course,
    courseSearch,
    coursePage,
  } = await searchParams;

  const normalizedPaymentStatus = PAYMENT_STATUSES.includes(
    paymentStatus as Transaction["paymentStatus"],
  )
    ? (paymentStatus as Transaction["paymentStatus"])
    : undefined;

  // GET /users/user/:id is Admin/Student only, so an instructor can't
  // resolve a selected student's name that way — fall back to matching it
  // against the (instructor-scoped) students list itself.
  const [response, studentsResponse, coursesResponse, selectedCourseResponse] =
    await Promise.all([
      getTransactionsQuery({
        search,
        page: page ? Number(page) : 1,
        paymentStatus: normalizedPaymentStatus,
        student,
        course,
      }),
      // Backend already scopes this to students enrolled in the
      // instructor's own courses.
      getStudentsQuery({
        search: studentSearch,
        page: studentPage ? Number(studentPage) : 1,
      }),
      // getCoursesQuery (not the public one) already scopes results to only
      // this instructor's own courses.
      getCoursesQuery({
        search: courseSearch,
        page: coursePage ? Number(coursePage) : 1,
      }),
      // Resolve the selected course's title so the picker can show it as
      // the trigger label even when it isn't on the current results page.
      course ? getCourseDetailsQuery(course) : null,
    ]);

  const selectedStudentLabel = student
    ? (studentsResponse.data.students.find((s) => s._id === student)
        ?.fullName ?? null)
    : null;

  return (
    <TransactionsTable
      basePath="/instructor/transactions"
      transactions={response.data.transactions}
      pagination={response.data.pagination}
      search={search ?? ""}
      paymentStatus={normalizedPaymentStatus ?? "all"}
      showInstructorColumn={false}
      studentFilter={{
        students: studentsResponse.data.students,
        studentsPagination: studentsResponse.data.pagination,
        studentSearch: studentSearch ?? "",
        student: student ?? "",
        selectedStudentLabel,
      }}
      courseFilter={{
        courses: coursesResponse.data.courses,
        coursesPagination: coursesResponse.data.pagination,
        courseSearch: courseSearch ?? "",
        course: course ?? "",
        selectedCourseLabel: selectedCourseResponse?.data.course.title ?? null,
      }}
    />
  );
};

export default InstructorTransactionsPage;
