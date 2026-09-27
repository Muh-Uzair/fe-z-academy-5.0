import Courses from "@/features/course-management/Courses";
import { getPublicCoursesQuery } from "@/services/course/queries";
import { getCategoriesQuery } from "@/services/category/queries";

type CoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    category?: string;
    categorySearch?: string;
    categoryPage?: string;
    level?: string;
    maxPrice?: string;
    minRating?: string;
    duration?: string;
  }>;
};

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  const { 
    search, page, category, categorySearch, categoryPage, level,
    maxPrice, minRating, duration
  } = await searchParams;

  const normalizedLevel =
    level === "beginner" || level === "intermediate" || level === "advanced"
      ? level
      : undefined;

  let minDuration: number | undefined;
  let maxDuration: number | undefined;
  if (duration === "Under 2 hours") { minDuration = 0; maxDuration = 120; }
  else if (duration === "2 – 5 hours") { minDuration = 120; maxDuration = 300; }
  else if (duration === "5 – 10 hours") { minDuration = 300; maxDuration = 600; }
  else if (duration === "10+ hours") { minDuration = 600; maxDuration = 999999; }

  const [coursesRes, categoriesRes] = await Promise.all([
    getPublicCoursesQuery({
      search,
      page: page ? Number(page) : 1,
      limit: 12,
      category: category && category !== "all" ? category : undefined,
      level: normalizedLevel,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      minDuration,
      maxDuration,
    }),
    getCategoriesQuery({
      search: categorySearch,
      page: categoryPage ? Number(categoryPage) : 1,
      limit: 10,
    }),
  ]);

  const categoryItems = categoriesRes.data.categories.map((c) => ({
    id: c._id,
    label: c.name,
  }));

  return (
    <Courses
      courses={coursesRes.data.courses}
      pagination={coursesRes.data.pagination}
      initialSearch={search ?? ""}
      category={category ?? "all"}
      level={normalizedLevel ?? "all"}
      maxPrice={maxPrice ? Number(maxPrice) : 1000}
      minRating={minRating ? Number(minRating) : null}
      duration={duration ?? null}
      categoryItems={categoryItems}
      categoryPagination={categoriesRes.data.pagination}
      categorySearch={categorySearch ?? ""}
    />
  );
};

export default CoursesPage;
