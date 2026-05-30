"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, Play, BookOpen, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Course, CourseLevel } from "@/types/courseTypes";

// --- Dummy Data ---
const activeCourses: Course[] = [
  {
    _id: "ac1",
    title: "Full Stack Web Development with MERN",
    description: "Learn MERN stack from scratch and build real-world apps.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video1",
    price: 49.99,
    level: CourseLevel.Beginner,
    instructor: "John Smith",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 120,
    totalStudentsEnrolled: 1500,
    totalDurationInMinutes: 420,
    totalDurationWatchedInMinutes: 273, // 65%
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ac2",
    title: "Advanced CSS Patterns & Animations",
    description: "Deep dive into CSS architecture.",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video2",
    price: 29.99,
    level: CourseLevel.Intermediate,
    instructor: "Sarah Johnson",
    category: "Design",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.8,
    totalReviews: 85,
    totalStudentsEnrolled: 900,
    totalDurationInMinutes: 300,
    totalDurationWatchedInMinutes: 60, // 20%
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ac3",
    title: "Node.js API Mastery",
    description: "Build scalable backend APIs using Node.js and Express.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video3",
    price: 39.99,
    level: CourseLevel.Advanced,
    instructor: "Ali Khan",
    category: "Backend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.3,
    totalReviews: 60,
    totalStudentsEnrolled: 700,
    totalDurationInMinutes: 280,
    totalDurationWatchedInMinutes: 224, // 80%
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "ac4",
    title: "UI/UX Design Fundamentals",
    description: "Master modern UI/UX design principles.",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/video4",
    price: 19.99,
    level: CourseLevel.Beginner,
    instructor: "Emily Watson",
    category: "Design",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.7,
    totalReviews: 140,
    totalStudentsEnrolled: 1700,
    totalDurationInMinutes: 600,
    totalDurationWatchedInMinutes: 30, // 5%
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];


const ContinueWatching = () => {
  // First course is the "Hero" course, the rest go in the grid.
  const heroCourse = activeCourses[0];
  const otherCourses = activeCourses.slice(1);

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Continue Watching"
        pageDescription="Pick up right where you left off and hit your learning goals."
      />

      {/* Hero Section */}
      {heroCourse && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">Most recently seen</h2>
          <Card className="overflow-hidden border-2 shadow-sm transition-all hover:shadow-md group relative">
            <div className="flex flex-col md:flex-row">
              {/* Left side: Large Thumbnail */}
              <div className="md:w-5/12 lg:w-4/12 relative overflow-hidden">
                <Link href={`/course-details/${heroCourse._id}?role=student`}>
                  <AspectRatio ratio={16 / 9} className="md:h-full">
                    <img
                      src={heroCourse.thumbnail}
                      alt={heroCourse.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                  </AspectRatio>
                </Link>
              </div>

              {/* Right side: Content */}
              <div className="flex flex-col flex-1 p-6 md:p-8 justify-center bg-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Most recently seen</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                  {heroCourse.title}
                </h3>

                <p className="text-muted-foreground mb-6">
                  Instructor: <span className="font-medium text-foreground">{heroCourse.instructor}</span>
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-right ml-auto">
                      <span className="text-2xl font-bold text-primary">
                        {Math.round(((heroCourse.totalDurationWatchedInMinutes || 0) / heroCourse.totalDurationInMinutes) * 100)}%
                      </span>
                      <p className="text-xs text-muted-foreground font-medium">Complete</p>
                    </div>
                  </div>

                  <Progress value={((heroCourse.totalDurationWatchedInMinutes || 0) / heroCourse.totalDurationInMinutes) * 100} className="h-2.5 bg-primary/10" />

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {heroCourse.totalDurationWatchedInMinutes}m / {heroCourse.totalDurationInMinutes}m watched
                    </span>

                    <Button asChild>
                      <Link href={`/course-details/${heroCourse._id}?role=student`}>
                        <PlayCircle className="h-5 w-5" />Resume Course
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Grid of Other Courses */}
      {otherCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">In Progress</h2>
          <AppCourseCardsGridLayout
            courses={otherCourses}
            mode="in-progress"
            renderFooter={(course) => (
              <Button asChild>
                <Link href={`/course-details/${course._id}?role=student`}>
                  Resume
                </Link>
              </Button>
            )}
            pagination={true}
          />
        </section>
      )}
    </PageFlexCol>
  );
};

export default ContinueWatching;
