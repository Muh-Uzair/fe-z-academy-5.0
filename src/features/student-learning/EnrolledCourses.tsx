"use client";


import Link from "next/link";
import { useState } from "react";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Button } from "@/components/ui/button";
import { coursesData as enrolledCoursesMockData } from "@/dummy-data/coursesData";
import { type CourseRecord } from "@/types/courseTypes";

const EnrolledCourses = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = enrolledCoursesMockData.filter((course) => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.instructorName.toLowerCase().includes(normalizedSearch) ||
      course.categoryName.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Enrolled Courses"
        pageDescription="Browse and manage all courses you are currently enrolled in."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search enrolled courses..."
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        data={filteredCourses}
        columns={[
          {
            key: "thumbnail",
            label: "Thumbnail",
            render: (value: string, row: CourseRecord) => (
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
            key: "instructorName",
            label: "Instructor",
          },
          {
            key: "categoryName",
            label: "Category",
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseRecord) => (
              <Button asChild>
                <Link
                 href={`/course-details/${row._id}?role=student&source=enrolled`}
                >
                  View Details
                </Link>
              </Button>
            ),
          },
        ]}
        pagination={true}
      />
    </PageFlexCol>
  );
};

export default EnrolledCourses;