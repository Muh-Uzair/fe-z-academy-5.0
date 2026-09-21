import AdminEnrollments from "@/features/financials-and-notifications/AdminEnrollments";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";

type AdminEnrollmentsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const AdminEnrollmentsPage = async ({
  searchParams,
}: AdminEnrollmentsPageProps) => {
  const { page } = await searchParams;
  const response = await getEnrollmentsQuery({
    page: page ? Number(page) : 1,
  });

  return (
    <AdminEnrollments
      enrollments={response.data.enrollments}
      pagination={response.data.pagination}
    />
  );
};

export default AdminEnrollmentsPage;
