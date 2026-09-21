import StudentEnrollments from "@/features/student-learning/StudentEnrollments";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";

type StudentEnrollmentsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const StudentEnrollmentsPage = async ({
  searchParams,
}: StudentEnrollmentsPageProps) => {
  const { page } = await searchParams;
  const response = await getEnrollmentsQuery({
    page: page ? Number(page) : 1,
  });

  return (
    <StudentEnrollments
      enrollments={response.data.enrollments}
      pagination={response.data.pagination}
    />
  );
};

export default StudentEnrollmentsPage;
