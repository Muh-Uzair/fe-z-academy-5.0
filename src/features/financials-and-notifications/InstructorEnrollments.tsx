"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { coursesData } from "@/dummy-data/coursesData";
import AppButton from "@/components/AppButton";

const InstructorEnrollments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return coursesData;
    return coursesData.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col space-y-6 max-w-[1200px] mx-auto w-full">
      <PageHeader
        pageHeading="Course Enrollments"
        pageDescription="View and manage student enrollments across all courses."
      />

      <AppCourseCardsGridLayout
        courses={filteredCourses}
        pagination={true}
        upperHeader={
          <div className="w-full sm:w-96">
            <AppSearchBar
              placeholder="Search courses..."
              onChange={(val) => setSearchQuery(val)}
            />
          </div>
        }
        renderFooter={(course) => (
          <AppButton asChild className="w-full">
            <Link href={`/course-enrollments/${course._id}`}>
              View Enrollments
            </Link>
          </AppButton>
        )}
      />
    </div>
  );
};

export default InstructorEnrollments;
