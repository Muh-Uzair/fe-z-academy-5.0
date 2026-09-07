"use client";

import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import AppButton from "@/components/AppButton";

import type { PublicCourseListItem } from "@/response-types/courseResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

type BrowseCoursesProps = {
  courses: PublicCourseListItem[];
  pagination: Pagination;
  search: string;
};

const BrowseCourses = ({ courses, pagination, search }: BrowseCoursesProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/student/browse-courses${query ? `?${query}` : ""}`);
  };

  const gridCourses = courses.map((course) => ({
    _id: course._id,
    title: course.title,
    thumbnail: course.thumbnailUrl,
    price: course.price,
    level: course.level,
    instructor: course.instructorDetails.fullName,
    category: course.categoryDetails.name,
    averageRating: course.averageRating,
    totalReviews: course.totalReviews,
    totalStudentsEnrolled: course.totalStudentsEnrolled,
    totalDurationInMinutes: course.totalDurationInMinutes,
  }));

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Browse Courses"
        pageDescription="Explore available courses and start learning today."
      />

      <AppCourseCardsGridLayout
        courses={gridCourses}
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search courses by title, category or instructor..."
              defaultValue={search}
              onChange={(value: string) =>
                updateQuery({ search: value, page: 1 })
              }
            />
          </div>
        }
        renderFooter={(course) => (
          <AppButton
            className="w-full"
            onClick={() =>
              router.push(
                `/course-details/${course._id}?role=student&source=browse`,
              )
            }
          >
            View Details
          </AppButton>
        )}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
      />
    </PageFlexCol>
  );
};

export default BrowseCourses;
