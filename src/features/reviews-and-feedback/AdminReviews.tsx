"use client";

import { useRouter } from "next/navigation";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import AppButton from "@/components/AppButton";
import AppSearchBar from "@/components/AppSearchBar";
import PagedSearchSelect from "@/components/PagedSearchSelect";
import type { CourseListItem } from "@/response-types/courseResponseTypes";
import type { Pagination, UserDetails } from "@/response-types/userResponseTypes";

const ALL_INSTRUCTORS_ITEM = { id: "", label: "All instructors" };

type AdminReviewsProps = {
  courses: CourseListItem[];
  pagination: Pagination;
  search: string;
  instructors: UserDetails[];
  instructorsPagination: Pagination;
  instructorSearch: string;
  instructor: string;
  selectedInstructorLabel: string | null;
};

const AdminReviews = ({
  courses,
  pagination,
  search,
  instructors,
  instructorsPagination,
  instructorSearch,
  instructor,
  selectedInstructorLabel,
}: AdminReviewsProps) => {
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
    if (nextInstructorSearch) searchParams.set("instructorSearch", nextInstructorSearch);
    if (nextInstructorPage > 1) searchParams.set("instructorPage", String(nextInstructorPage));
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/admin/reviews${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Course Reviews"
        pageDescription="View and manage reviews for all courses across the platform."
      />
      <AppCourseCardsGridLayout
        courses={courses}
        upperHeader={
          <div className="flex flex-wrap items-center gap-3">
            <div className="max-w-sm flex-1">
              <AppSearchBar
                placeholder="Search courses by title, category or instructor..."
                defaultValue={search}
                onChange={(value: string) => updateQuery({ search: value, page: 1 })}
              />
            </div>

            <div className="w-[220px]">
              <PagedSearchSelect
                items={[
                  ALL_INSTRUCTORS_ITEM,
                  ...instructors.map((i) => ({ id: i._id, label: i.fullName })),
                ]}
                pagination={instructorsPagination}
                search={instructorSearch}
                value={instructor}
                onValueChange={(value) => updateQuery({ instructor: value, page: 1 })}
                onSearchChange={(value) =>
                  updateQuery({ instructorSearch: value, instructorPage: 1 })
                }
                onPageChange={(value) => updateQuery({ instructorPage: value })}
                selectedLabel={instructor ? selectedInstructorLabel : "All instructors"}
                placeholder="Filter by instructor"
                searchPlaceholder="Search instructors..."
              />
            </div>
          </div>
        }
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
        renderFooter={(course) => (
          <AppButton href={`/view-course-reviews/${course._id}`} className="w-full mt-2">
            View Reviews
          </AppButton>
        )}
      />
    </PageFlexCol>
  );
};

export default AdminReviews;
