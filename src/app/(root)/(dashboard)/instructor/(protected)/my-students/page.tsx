import InstructorMyStudents from "@/features/auth-and-user-management/InstructorMyStudents";
import { getStudentsQuery } from "@/services/user/queries";

type InstructorMyStudentsPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const InstructorMyStudentsPage = async ({
  searchParams,
}: InstructorMyStudentsPageProps) => {
  const { search, page } = await searchParams;
  const response = await getStudentsQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <InstructorMyStudents
      students={response.data.students}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default InstructorMyStudentsPage;
