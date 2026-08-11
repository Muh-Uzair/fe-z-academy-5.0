"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Button } from "@/components/ui/button";

import { Course, CourseLevel } from "@/types/courseTypes";

import { coursesData as courses } from "@/dummy-data/coursesData";
// -------------------- Page --------------------

const BrowseCourses = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Browse Courses"
        pageDescription="Explore available courses and start learning today."
      />

      <AppCourseCardsGridLayout
        courses={filteredCourses}
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search courses by title, category or instructor..."
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        renderFooter={(course) => (
          <Button
            className="w-full"
            onClick={() =>
              router.push(
                `/course-details/${course._id}?role=student&source=browse`,
              )
            }
          >
            View Details
          </Button>
        )}
        pagination={true}
      />
    </PageFlexCol>
  );
};

export default BrowseCourses;
