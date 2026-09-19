import AdminStudents from "@/features/auth-and-user-management/AdminStudents";
import { getStudentsQuery } from "@/services/user/queries";

type AdminStudentsPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const AdminStudentsPage = async ({ searchParams }: AdminStudentsPageProps) => {
  const { search, page } = await searchParams;

  const response = await getStudentsQuery({
    search,
    page: page ? Number(page) : 1,
  });

  const students = response.status === "success" ? response.data.students : [];
  const pagination =
    response.status === "success" ? response.data.pagination : null;

  return (
    <AdminStudents
      students={students}
      pagination={pagination}
      search={search ?? ""}
    />
  );
};

export default AdminStudentsPage;
