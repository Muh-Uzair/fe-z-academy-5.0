"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Button } from "@/components/ui/button";

import { Course, CourseLevel } from "@/types/courseTypes";

// -------------------- Dummy Data --------------------

const courses: Course[] = [
  {
    _id: "c1",
    title: "Full Stack Web Development with MERN",
    description: "Learn MERN stack from scratch and build real-world apps.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video1",
    price: 49,
    level: CourseLevel.Beginner,
    instructor: "John Smith",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 120,
    totalStudentsEnrolled: 1500,
    totalDurationInMinutes: 420,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "c2",
    title: "Advanced React Patterns",
    description: "Deep dive into React architecture and patterns.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video2",
    price: 69,
    level: CourseLevel.Advanced,
    instructor: "Sarah Johnson",
    category: "Frontend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.8,
    totalReviews: 85,
    totalStudentsEnrolled: 900,
    totalDurationInMinutes: 300,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "c3",
    title: "Node.js API Mastery",
    description: "Build scalable backend APIs using Node.js and Express.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video3",
    price: 39,
    level: CourseLevel.Intermediate,
    instructor: "Ali Khan",
    category: "Backend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.3,
    totalReviews: 60,
    totalStudentsEnrolled: 700,
    totalDurationInMinutes: 280,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// -------------------- Page --------------------

const BrowseCourses = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
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
                `/student/course-details/${course._id}`,
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
