"use client";

import React, { useState, useMemo } from "react";
import { usersData } from "@/dummy-data/usersData";
import { coursesData } from "@/dummy-data/coursesData";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import AppButton from "@/components/AppButton";

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const user = useMemo(() => {
    return usersData.find((u) => u._id === userId) || usersData[0]; // fallback if not found
  }, [userId]);

  const relatedCourses = useMemo(() => {
    let courses = [];
    if (user.role === "instructor") {
      courses = coursesData.filter((c) => c.instructor === user._id);
    } else {
      // Dummy logic: mock student enrolled courses by picking the first few courses
      courses = coursesData.slice(0, 4);
    }

    if (!searchQuery) return courses;
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [user, searchQuery]);

  if (!user) return <div>User not found</div>;

  const coursesHeading =
    user.role === "instructor" ? "Courses Taught" : "Enrolled Courses";
  const coursesDescription =
    user.role === "instructor"
      ? "Courses created and managed by this instructor."
      : "Courses this student is currently enrolled in.";

  return (
    <div className="flex flex-col space-y-8 max-w-[1200px] mx-auto w-full py-6">
      {/* User Info Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-card p-8 rounded-2xl border shadow-sm relative">
        <div className="absolute top-4 right-4">
          <Badge
            variant="secondary"
            className="capitalize text-sm px-3 py-1 border-border/50 shadow-sm"
          >
            {user.role}
          </Badge>
        </div>

        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`
          }
          alt={user.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md"
        />

        <div className="flex flex-col space-y-3 flex-1">
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>

          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

          <div className="flex gap-6 mt-2">
            {user.highestEducation && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-medium">{user.highestEducation}</span>
              </div>
            )}
            {user.yearsOfExperience !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {user.yearsOfExperience} Years Experience
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Courses Section */}
      <div className="flex flex-col space-y-6">
        <PageHeader
          pageHeading={coursesHeading}
          pageDescription={coursesDescription}
        />

        <AppCourseCardsGridLayout
          courses={relatedCourses}
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
                View Course
              </Link>
            </AppButton>
          )}
        />
      </div>
    </div>
  );
};

export default UserProfile;
