import TransactionsTable from "@/features/transaction-management/TransactionsTable";
import { getTransactionsQuery } from "@/services/transaction/queries";
import { getInstructorsQuery, getUserDetailsQuery } from "@/services/user/queries";
import { getCoursesQuery, getCourseDetailsQuery } from "@/services/course/queries";
import type { Transaction } from "@/response-types/transactionResponseTypes";

type StudentTransactionsPageProps = {
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
  }>;
};

const PAYMENT_STATUSES: Transaction["paymentStatus"][] = [
  "pending",
  "paid",
  "failed",
  "refund_processing",
  "refunded",
];

const StudentTransactionsPage = async ({
  searchParams,
}: StudentTransactionsPageProps) => {
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
  ] = await Promise.all([
    getTransactionsQuery({
      search,
      page: page ? Number(page) : 1,
      paymentStatus: normalizedPaymentStatus,
      instructor,
      course,
    }),
    // Backend already scopes this to instructors whose course the student
    // has bought.
    getInstructorsQuery({
      search: instructorSearch,
      page: instructorPage ? Number(instructorPage) : 1,
    }),
    // Resolve the selected instructor's name so the picker can show it as
    // the trigger label even when it isn't on the current results page.
    instructor ? getUserDetailsQuery(instructor, "instructor") : null,
    // getCoursesQuery already scopes results to courses this student is
    // enrolled in.
    getCoursesQuery({
      search: courseSearch,
      page: coursePage ? Number(coursePage) : 1,
    }),
    // Resolve the selected course's title so the picker can show it as the
    // trigger label even when it isn't on the current results page.
    course ? getCourseDetailsQuery(course) : null,
  ]);

  return (
    <TransactionsTable
      basePath="/student/transactions"
      transactions={response.data.transactions}
      pagination={response.data.pagination}
      search={search ?? ""}
      paymentStatus={normalizedPaymentStatus ?? "all"}
      showStudentColumn={false}
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
    />
  );
};

export default StudentTransactionsPage;
