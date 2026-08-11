"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppUserCardsGridLayout from "@/components/AppUserCardsGridLayout";
import { usersData } from "@/dummy-data/usersData";
import { Button } from "@/components/ui/button";

const CourseEnrollments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const enrolledStudents = useMemo(() => {
    // Simulate fetching only students for this course
    const students = usersData.filter((u) => u.role === "student");
    if (!searchQuery) return students;
    return students.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col space-y-6 max-w-[1200px] mx-auto w-full py-3">
      <PageHeader
        pageHeading="Course Enrollments"
        pageDescription="View all students enrolled in this course."
      />

      <AppUserCardsGridLayout
        users={enrolledStudents}
        pagination={true}
        upperHeader={
          <div className="w-full sm:w-96">
            <AppSearchBar
              placeholder="Search students by name or email..."
              onChange={(val) => setSearchQuery(val)}
            />
          </div>
        }
        renderFooter={(user) => (
          <Button asChild className="w-full">
            <Link href={`/user-profile/${user._id}`}>View Profile</Link>
          </Button>
        )}
      />
    </div>
  );
};

export default CourseEnrollments;
