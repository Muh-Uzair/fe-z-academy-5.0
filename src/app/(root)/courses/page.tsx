import Courses from "@/features/course-management/Courses";
import { getPublicCoursesQuery } from "@/services/course/queries";

type CoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  const { search, page } = await searchParams;

  const response = await getPublicCoursesQuery({
    search,
    page: page ? Number(page) : 1,
    limit: 12,
  });

  return (
    <Courses
      courses={response.data.courses}
      pagination={response.data.pagination}
      initialSearch={search ?? ""}
    />
  );
};

export default CoursesPage;
