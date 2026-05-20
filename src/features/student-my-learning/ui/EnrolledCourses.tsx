"use client";


import Link from "next/link";
import { useState } from "react";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Button } from "@/components/ui/button";
import { Course, CourseLevel } from "@/types/courseTypes";


const enrolledCoursesMockData: Course[] = [
  {
    _id: "course_001",
    title: "Complete React Masterclass",
    description: "Learn React from beginner to advanced level.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    videoUrl: "https://example.com/react-course",
    price: 49,
    level: CourseLevel.Beginner,
    instructor: "John Doe",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.8,
    totalReviews: 220,
    totalStudentsEnrolled: 3200,
    totalDurationInMinutes: 720,
    createdAt: "2026-01-10",
    updatedAt: "2026-02-15",
  },
  {
    _id: "course_002",
    title: "Advanced Node.js API Development",
    description: "Build scalable backend applications with Node.js.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    videoUrl: "https://example.com/node-course",
    price: 59,
    level: CourseLevel.Advanced,
    instructor: "Sarah Khan",
    category: "Backend Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 180,
    totalStudentsEnrolled: 2100,
    totalDurationInMinutes: 840,
    createdAt: "2026-01-12",
    updatedAt: "2026-02-18",
  },
  {
    _id: "course_003",
    title: "UI/UX Design Fundamentals",
    description: "Master modern UI/UX design principles.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    videoUrl: "https://example.com/uiux-course",
    price: 39,
    level: CourseLevel.Intermediate,
    instructor: "Emily Watson",
    category: "Design",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.7,
    totalReviews: 140,
    totalStudentsEnrolled: 1700,
    totalDurationInMinutes: 600,
    createdAt: "2026-01-20",
    updatedAt: "2026-02-20",
  },
];


const EnrolledCourses = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = enrolledCoursesMockData.filter((course) => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.instructor.toLowerCase().includes(normalizedSearch) ||
      course.category.toLowerCase().includes(normalizedSearch)
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
            render: (value: string, row: Course) => (
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
            key: "instructor",
            label: "Instructor",
          },
          {
            key: "category",
            label: "Category",
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: Course) => (
              <Button asChild>
                <Link
                  href={`/student/course-details/${row._id}`}
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