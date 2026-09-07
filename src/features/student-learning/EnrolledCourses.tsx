"use client";

import { useRouter } from "next/navigation";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import AppButton from "@/components/AppButton";
import type {
  CourseListItem,
  CourseCategorySummary,
  CourseInstructorSummary,
} from "@/response-types/courseResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import { formatCourseLevel } from "@/features/course-management/courseHelpers";

type EnrolledCoursesProps = {
  courses: CourseListItem[];
  pagination: Pagination;
  search: string;
};

const EnrolledCourses = ({
  courses,
  pagination,
  search,
}: EnrolledCoursesProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(
      `/student/my-learning/enrolled-courses${query ? `?${query}` : ""}`,
    );
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Enrolled Courses"
        pageDescription="Browse and manage all courses you are currently enrolled in."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search enrolled courses..."
              defaultValue={search}
              onChange={(value: string) =>
                updateQuery({ search: value, page: 1 })
              }
            />
          </div>
        }
        data={courses}
        columns={[
          {
            key: "thumbnailUrl",
            label: "Thumbnail",
            render: (value: string, row: CourseListItem) => (
              <TableImage src={value} alt={row.title} shape="rectangle" />
            ),
          },
          {
            key: "title",
            label: "Title",
            render: (value: string) => (
              <span className="font-medium">{value}</span>
            ),
          },
          {
            key: "instructorDetails",
            label: "Instructor",
            render: (value: CourseInstructorSummary) => value.fullName,
          },
          {
            key: "level",
            label: "Level",
            render: (value: string) => formatCourseLevel(value),
          },
          {
            key: "categoryDetails",
            label: "Category",
            render: (value: CourseCategorySummary) => value.name,
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseListItem) => (
              <AppButton
                href={`/course-details/${row._id}?role=student&source=enrolled`}
              >
                View Details
              </AppButton>
            ),
          },
        ]}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
      />
    </PageFlexCol>
  );
};

export default EnrolledCourses;
