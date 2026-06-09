"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { coursesData } from "@/dummy-data/coursesData";
import { Search } from "lucide-react";

const StudentChat = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upperHeader = (
    <div className="relative max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search enrolled courses..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Course Discussions"
        pageDescription="Connect with your instructors and classmates."
      />

      <AppCourseCardsGridLayout
        courses={filteredCourses}
        upperHeader={upperHeader}
        pagination={true}
        renderFooter={(course) => (
          <div className="flex flex-col gap-2 w-full mt-2">
            <Button asChild variant="default" className="w-full">
              <Link href={`/public-course-chat/${course._id}`}>
                Public Chat
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/private-course-chat/${course._id}`}>
                Private Chat
              </Link>
            </Button>
          </div>
        )}
      />
    </PageFlexCol>
  );
};

export default StudentChat;
