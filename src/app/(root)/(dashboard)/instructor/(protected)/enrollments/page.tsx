import InstructorEnrollments from "@/features/financials-and-notifications/InstructorEnrollments";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";

type InstructorEnrollmentsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const InstructorEnrollmentsPage = async ({
  searchParams,
}: InstructorEnrollmentsPageProps) => {
  const { page } = await searchParams;
  const response = await getEnrollmentsQuery({
    page: page ? Number(page) : 1,
  });

  return (
    <InstructorEnrollments
      enrollments={response.data.enrollments}
      pagination={response.data.pagination}
    />
  );
};

export default InstructorEnrollmentsPage;
