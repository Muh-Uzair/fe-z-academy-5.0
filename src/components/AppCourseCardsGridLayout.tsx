"use client";

import React, { ReactNode } from "react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import type { Pagination as PaginationMeta } from "@/response-types/userResponseTypes";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  level: string;
  instructor: string;
  category: string;
  averageRating: number;
  totalReviews: number;
  totalStudentsEnrolled: number;
  totalDurationInMinutes: number;
  totalDurationWatchedInMinutes?: number;
}

interface AppCourseCardsGridLayoutProps {
  courses: Course[];
  upperHeader?: ReactNode;
  pagination?: boolean;
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  renderFooter?: (course: Course) => ReactNode;
  mode?: "default" | "in-progress";
}

const AppCourseCardsGridLayout = ({
  courses = [],
  upperHeader = null,
  pagination = false,
  paginationMeta,
  onPageChange,
  renderFooter,
  mode = "default",
}: AppCourseCardsGridLayoutProps) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      {upperHeader && <div className="pb-6">{upperHeader}</div>}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            mode={mode}
            footer={renderFooter ? renderFooter(course) : null}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {paginationMeta
              ? `Showing ${courses.length} of ${paginationMeta.totalDocuments} courses`
              : `Showing ${courses.length} courses`}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!paginationMeta?.hasPrevPage}
              onClick={() =>
                onPageChange?.((paginationMeta?.page ?? 1) - 1)
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!paginationMeta?.hasNextPage}
              onClick={() =>
                onPageChange?.((paginationMeta?.page ?? 1) + 1)
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppCourseCardsGridLayout;
