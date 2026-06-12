"use client";

import React, { useState } from "react";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { coursesData } from "@/dummy-data/coursesData";
import AppSearchBar from "@/components/AppSearchBar";

const InstructorReviews = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = coursesData.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="My Courses Reviews"
        pageDescription="View what your students are saying about your courses."
      />
      <AppCourseCardsGridLayout
        courses={filteredCourses as any}
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search courses by title, category or instructor..."
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        pagination={true}
        renderFooter={(course) => (
          <Button asChild className="w-full mt-2">
            <Link href={`/view-course-reviews/${course._id}`}>
              View Reviews
            </Link>
          </Button>
        )}
      />
    </PageFlexCol>
  );
};

export default InstructorReviews;
