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
  instructorCoursesMockData,
  type InstructorCourseRecord,
} from "./instructorCourseMockData";

const LOGGED_IN_INSTRUCTOR_ID = "user_001";
const getVerificationLabel = (course: InstructorCourseRecord) =>
  course.isVerified ? "Verified" : "Not Verified";

const AllMyCourses = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = instructorCoursesMockData.filter((course) => {
    if (course.instructor !== LOGGED_IN_INSTRUCTOR_ID) {
      return false;
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.categoryName.toLowerCase().includes(normalizedSearch) ||
      course.level.toLowerCase().includes(normalizedSearch) ||
      getVerificationLabel(course).toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="All My Courses"
        pageDescription="Review all courses created by the logged-in instructor, including verification state and key performance metrics."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search my courses..."
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        data={filteredCourses}
        columns={[
          {
            key: "thumbnail",
            label: "Thumbnail",
            render: (value: string, row: InstructorCourseRecord) => (
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
            key: "price",
            label: "Price",
            render: (value: number) => `$${value}`,
          },
          {
            key: "level",
            label: "Level",
            render: (value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1),
          },
          {
            key: "categoryName",
            label: "Category",
          },
          {
            key: "isVerified",
            label: "Verification",
            render: (value: boolean, row: InstructorCourseRecord) => (
              <Badge variant={value ? "default" : "secondary"}>
                {getVerificationLabel(row)}
              </Badge>
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
            render: (_: unknown, row: InstructorCourseRecord) => (
              <Button asChild>
                <Link href={`/instructor/my-courses/course-details/${row._id}`}>
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

export default AllMyCourses;
