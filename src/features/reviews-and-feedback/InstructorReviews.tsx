"use client";

import { useRouter } from "next/navigation";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import AppButton from "@/components/AppButton";
import AppSearchBar from "@/components/AppSearchBar";
import type { CourseListItem } from "@/response-types/courseResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

type InstructorReviewsProps = {
  courses: CourseListItem[];
  pagination: Pagination;
  search: string;
};

const InstructorReviews = ({
  courses,
  pagination,
  search,
}: InstructorReviewsProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/instructor/reviews${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="My Courses Reviews"
        pageDescription="View what your students are saying about your courses."
      />
      <AppCourseCardsGridLayout
        courses={courses}
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search courses by title..."
              defaultValue={search}
              onChange={(value: string) => updateQuery({ search: value, page: 1 })}
            />
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

export default InstructorReviews;
