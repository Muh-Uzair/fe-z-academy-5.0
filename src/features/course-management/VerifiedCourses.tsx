"use client";

import { useRouter } from "next/navigation";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import PagedSearchSelect from "@/components/PagedSearchSelect";
import type {
  CourseListItem,
  CourseCategorySummary,
  CourseInstructorSummary,
} from "@/response-types/courseResponseTypes";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";
import {
  formatCourseLevel,
  getCourseVerificationBadgeVariant,
  getCourseVerificationLabel,
} from "@/features/course-management/courseHelpers";

const ALL_INSTRUCTORS_ITEM = { id: "", label: "All instructors" };

type VerifiedCoursesProps = {
  courses: CourseListItem[];
  pagination: Pagination;
  search: string;
  instructors: UserDetails[];
  instructorsPagination: Pagination;
  instructorSearch: string;
  instructor: string;
  selectedInstructorLabel: string | null;
};

const VerifiedCourses = ({
  courses,
  pagination,
  search,
  instructors,
  instructorsPagination,
  instructorSearch,
  instructor,
  selectedInstructorLabel,
}: VerifiedCoursesProps) => {
  const router = useRouter();

  const updateQuery = (next: {
    search?: string;
    page?: number;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: number;
  }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;
    const nextInstructor = next.instructor ?? instructor;
    const nextInstructorSearch = next.instructorSearch ?? instructorSearch;
    const nextInstructorPage =
      next.instructorPage ?? instructorsPagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextInstructor) searchParams.set("instructor", nextInstructor);
    if (nextInstructorSearch)
      searchParams.set("instructorSearch", nextInstructorSearch);
    if (nextInstructorPage > 1)
      searchParams.set("instructorPage", String(nextInstructorPage));
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/admin/courses/verified-courses${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Verified Courses"
        pageDescription="View all admin-approved courses that are currently live from the instructor review flow."
      />

      <AppTable
        upperHeader={
          <div className="flex flex-wrap items-center gap-3">
            <div className="max-w-sm flex-1">
              <AppSearchBar
                placeholder="Search verified courses..."
                defaultValue={search}
                onChange={(value: string) =>
                  updateQuery({ search: value, page: 1 })
                }
              />
            </div>

            <div className="w-[220px]">
              <PagedSearchSelect
                items={[
                  ALL_INSTRUCTORS_ITEM,
                  ...instructors.map((instructorOption) => ({
                    id: instructorOption._id,
                    label: instructorOption.fullName,
                  })),
                ]}
                pagination={instructorsPagination}
                search={instructorSearch}
                value={instructor}
                onValueChange={(value) =>
                  updateQuery({ instructor: value, page: 1 })
                }
                onSearchChange={(value) =>
                  updateQuery({ instructorSearch: value, instructorPage: 1 })
                }
                onPageChange={(value) => updateQuery({ instructorPage: value })}
                selectedLabel={
                  instructor ? selectedInstructorLabel : "All instructors"
                }
                placeholder="Filter by instructor"
                searchPlaceholder="Search instructors..."
              />
            </div>
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
            key: "price",
            label: "Price",
            render: (value: number) => `$${value}`,
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
            key: "isVerified",
            label: "Verification",
            render: (_: boolean, row: CourseListItem) => (
              <Badge variant={getCourseVerificationBadgeVariant(row)}>
                {getCourseVerificationLabel(row)}
              </Badge>
            ),
          },
          {
            key: "averageRating",
            label: "Average Rating",
            render: (value: number) => value.toFixed(1),
          },
          {
            key: "totalReviews",
            label: "Total Reviews",
          },
          {
            key: "totalStudentsEnrolled",
            label: "Students Enrolled",
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseListItem) => (
              <AppButton
                href={`/course-details/${row._id}?role=admin&review=true`}
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

export default VerifiedCourses;
