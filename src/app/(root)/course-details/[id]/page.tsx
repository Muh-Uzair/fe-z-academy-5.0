import CourseDetails, {
  type CourseViewerRole,
} from "@/features/course-management/CourseDetails";
import {
  getCourseDetailsQuery,
  getPublicCourseDetailsQuery,
} from "@/services/course/queries";
import { getCategoriesQuery } from "@/services/category/queries";

type CourseDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    role?: string;
    source?: string;
    categorySearch?: string;
    categoryPage?: string;
  }>;
};

const UnifiedCourseDetailsPage = async ({
  params,
  searchParams,
}: CourseDetailsPageProps) => {
  const { id } = await params;
  const { role, source, categorySearch, categoryPage } = await searchParams;
  const viewerRole = (role as CourseViewerRole) || "student";

  // A student reaching this page from the public browse-courses listing
  // hasn't enrolled yet, so the authenticated details endpoint (which
  // requires an enrollment for students) would 404 — use the public
  // endpoint instead, which only needs the course to be verified.
  const isFromBrowse = source === "browse";

  const course = isFromBrowse
    ? { ...(await getPublicCourseDetailsQuery(id)).data.course, videoUrl: "" }
    : (await getCourseDetailsQuery(id)).data.course;

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
      course={course}
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
