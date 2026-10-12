import CreateNewCourses from "@/features/course-management/CreateNewCourses";
import { getCategoriesQuery } from "@/services/category/queries";
import { getMeQuery } from "@/services/auth/queries";

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

  const [response, meResponse] = await Promise.all([
    getCategoriesQuery({
      search: categorySearch,
      page: categoryPage ? Number(categoryPage) : 1,
    }),
    getMeQuery(),
  ]);

  return (
    <CreateNewCourses
      isStripeOnboardingComplete={
        meResponse!.data.user.stripeOnboardingComplete === true
      }
      categories={response.data.categories}
      categoriesPagination={response.data.pagination}
      categorySearch={categorySearch ?? ""}
    />
  );
};

export default InstructorCreateNewCoursesPage;

