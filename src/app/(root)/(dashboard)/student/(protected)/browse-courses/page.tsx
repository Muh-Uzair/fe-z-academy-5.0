import BrowseCourses from "@/features/student-learning/BrowseCourses";
import { getPublicCoursesQuery } from "@/services/course/queries";

type StudentBrowseCoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

const StudentBrowseCoursesPage = async ({
  searchParams,
}: StudentBrowseCoursesPageProps) => {
  const { search, page } = await searchParams;

  const response = await getPublicCoursesQuery({
    search,
    page: page ? Number(page) : 1,
  });

  return (
    <BrowseCourses
      courses={response.data.courses}
      pagination={response.data.pagination}
      search={search ?? ""}
    />
  );
};

export default StudentBrowseCoursesPage;
