import CreateNewCourses from "@/features/course-management/CreateNewCourses";
import { getCategoriesQuery } from "@/services/category/queries";

type InstructorCreateNewCoursesPageProps = {
  searchParams: Promise<{
    categorySearch?: string;
    categoryPage?: string;
  }>;
};

const InstructorCreateNewCoursesPage = async ({
  searchParams,
}: InstructorCreateNewCoursesPageProps) => {
  const { categorySearch, categoryPage } = await searchParams;

  const response = await getCategoriesQuery({
    search: categorySearch,
    page: categoryPage ? Number(categoryPage) : 1,
  });

  return (
    <CreateNewCourses
      categories={response.data.categories}
      categoriesPagination={response.data.pagination}
      categorySearch={categorySearch ?? ""}
    />
  );
};

export default InstructorCreateNewCoursesPage;

