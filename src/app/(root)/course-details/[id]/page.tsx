import CourseDetails, {
  type CourseViewerRole,
} from "@/features/course-management/CourseDetails";
import { getCourseDetailsQuery } from "@/services/course/queries";
import { getCategoriesQuery } from "@/services/category/queries";

type CourseDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    role?: string;
    categorySearch?: string;
    categoryPage?: string;
  }>;
};

const UnifiedCourseDetailsPage = async ({
  params,
  searchParams,
}: CourseDetailsPageProps) => {
  const { id } = await params;
  const { role, categorySearch, categoryPage } = await searchParams;
  const viewerRole = (role as CourseViewerRole) || "student";

  const courseResponse = await getCourseDetailsQuery(id);

  // Categories are only needed for the instructor's edit-mode category
  // picker — skip the extra request for every other viewer.
  const categoriesResponse =
    viewerRole === "instructor"
      ? await getCategoriesQuery({
          search: categorySearch,
          page: categoryPage ? Number(categoryPage) : 1,
        })
      : null;

  return (
    <CourseDetails
      viewerRole={viewerRole}
      course={courseResponse.data.course}
      categories={categoriesResponse?.data.categories ?? []}
      categoriesPagination={
        categoriesResponse?.data.pagination ?? {
          page: 1,
          limit: 10,
          totalDocuments: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      }
      categorySearch={categorySearch ?? ""}
    />
  );
};

export default UnifiedCourseDetailsPage;
