"use client";

import React, { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { coursesData } from "@/dummy-data/coursesData";
import AppButton from "@/components/AppButton";

const AdminEnrollments = () => {
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
          <AppButton href={`/course-enrollments/${course._id}`} className="w-full">
              View Enrollments
            </AppButton>
        )}
      />
    </div>
  );
};

export default AdminEnrollments;
