import UserProfile from "@/features/auth-and-user-management/UserProfile";
import { getUserDetailsQuery } from "@/services/user/queries";
import {
  getInstructorCoursesQuery,
  getStudentCoursesQuery,
} from "@/services/course/queries";
import { notFound } from "next/navigation";
import type { CourseListItem } from "@/response-types/courseResponseTypes";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; search?: string; page?: string }>;
};

const UserProfilePage = async ({
  params,
  searchParams,
}: UserProfilePageProps) => {
  const { id } = await params;
  const { role, search, page } = await searchParams;

  // We require a role in the URL to fetch correctly. If omitted, default to student for safety
  // but this shouldn't happen from the admin views.
  const queryRole =
    role === "instructor" || role === "student" || role === "admin"
      ? role
      : "student";

  const userRes = await getUserDetailsQuery(id, queryRole).catch(() => null);

  if (!userRes || userRes.status !== "success") {
    notFound();
  }

  const user = userRes.data.user;
  const courseParams = {
    search,
    page: page ? Number(page) : 1,
  };

  let courses: CourseListItem[] = [];
  let pagination = null;

  if (queryRole === "instructor") {
    const courseRes = await getInstructorCoursesQuery(
      id,
      courseParams,
    ).catch(() => null);
    if (courseRes && courseRes.status === "success") {
      courses = courseRes.data.courses;
      pagination = courseRes.data.pagination;
    }
  } else if (queryRole === "student") {
    const courseRes = await getStudentCoursesQuery(
      id,
      courseParams,
    ).catch(() => null);
    if (courseRes && courseRes.status === "success") {
      courses = courseRes.data.courses;
      pagination = courseRes.data.pagination;
    }
  }

  return (
    <UserProfile
      user={user}
      courses={courses}
      pagination={pagination}
      search={search ?? ""}
      role={queryRole}
    />
  );
};

export default UserProfilePage;
