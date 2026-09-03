import AdminCategories from "@/features/course-management/AdminCategories";
import { getCategoriesQuery } from "@/services/category/queries";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const AdminCategoriesPage = async ({
  searchParams,
}: AdminCategoriesPageProps) => {
  const { search, page } = await searchParams;

  const response = await getCategoriesQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <AdminCategories
      categories={response.data.categories}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default AdminCategoriesPage;
