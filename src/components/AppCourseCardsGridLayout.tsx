"use client";

import React, { ReactNode } from "react";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";

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
}

interface AppCourseCardsGridLayoutProps {
  courses: Course[];
  upperHeader?: ReactNode;
  pagination?: boolean;
  renderFooter?: (course: Course) => ReactNode;
}

const AppCourseCardsGridLayout = ({
  courses = [],
  upperHeader = null,
  pagination = false,
  renderFooter,
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
            footer={renderFooter ? renderFooter(course) : null}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Showing {courses.length} courses
          </span>

          <div className="flex gap-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppCourseCardsGridLayout;
