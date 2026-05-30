"use client";

import Link from "next/link";
import { useState } from "react";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  courseMockData,
  type CourseRecord,
} from "@/features/course-management/ui/courseMockData";
import {
  formatCourseLevel,
  getCourseVerificationBadgeVariant,
  getCourseVerificationLabel,
} from "@/features/course-management/ui/courseHelpers";

const AllCourses = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = courseMockData.filter((course) => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.instructorName.toLowerCase().includes(normalizedSearch) ||
      course.categoryName.toLowerCase().includes(normalizedSearch) ||
      getCourseVerificationLabel(course)
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="All Courses"
        pageDescription="Review every instructor course on the platform, including verification state and performance metrics."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search courses..."
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
            key: "price",
            label: "Price",
            render: (value: number) => `$${value}`,
          },
          {
            key: "level",
            label: "Level",
            render: (value: string) => formatCourseLevel(value),
          },
          {
            key: "categoryName",
            label: "Category",
          },
          {
            key: "isVerified",
            label: "Verification",
            render: (_: boolean, row: CourseRecord) => (
              <>
                {row.isVerified === false && (
                  <Badge variant="destructive">Not verified</Badge>
                )}
                {row.isVerified && <Badge>Verified</Badge>}
              </>
            ),
          },
          {
            key: "averageRating",
            label: "Average Rating",
            render: (value: number) => value.toFixed(1),
          },
          {
            key: "totalReviews",
            label: "Total Reviews",
          },
          {
            key: "totalStudentsEnrolled",
            label: "Students Enrolled",
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseRecord) => (
              <Button asChild>
                <Link href={`/course-details/${row._id}?role=admin`}>
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

export default AllCourses;
