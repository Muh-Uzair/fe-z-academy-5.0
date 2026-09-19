"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Mail, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AppButton from "@/components/AppButton";
import type {
  UserDetails,
  Pagination as PaginationMeta,
} from "@/response-types/userResponseTypes";
import type { CourseListItem } from "@/response-types/courseResponseTypes";

interface UserProfileProps {
  user: UserDetails;
  courses: CourseListItem[];
  pagination: PaginationMeta | null;
  search: string;
  role: string;
}

const UserProfile = ({
  user,
  courses,
  pagination,
  search,
  role,
}: UserProfileProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination?.page ?? 1;

    const searchParams = new URLSearchParams();
    if (role) searchParams.set("role", role);
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/user-profile/${user._id}${query ? `?${query}` : ""}`);
  };

  const coursesHeading =
    role === "instructor" ? "Courses Taught" : "Enrolled Courses";
  const coursesDescription =
    role === "instructor"
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

        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md flex-shrink-0"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-background shadow-md bg-muted flex items-center justify-center flex-shrink-0">
            <User className="w-16 h-16 text-muted-foreground opacity-50" />
          </div>
        )}

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
          courses={courses}
          pagination={true}
          paginationMeta={pagination ?? undefined}
          onPageChange={(page) => updateQuery({ page })}
          upperHeader={
            <div className="w-full sm:w-96">
              <AppSearchBar
                placeholder="Search courses..."
                defaultValue={search}
                onChange={(val) => updateQuery({ search: val, page: 1 })}
              />
            </div>
          }
          renderFooter={(course) => (
            <AppButton
              href={`/course-details/${course._id}`}
              className="w-full"
            >
              View Course
            </AppButton>
          )}
        />
      </div>
    </div>
  );
};

export default UserProfile;
