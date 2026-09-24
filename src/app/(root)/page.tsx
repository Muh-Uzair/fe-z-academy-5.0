import { cookies } from "next/headers";

import Home from "@/features/course-management/Home";
import { getMeQuery } from "@/services/auth/queries";
import { getTopCategoriesQuery } from "@/services/category/queries";
import {
  getFeaturedCoursesQuery,
  getTrendingCoursesQuery,
} from "@/services/course/queries";
import type { AuthUser } from "@/response-types/authResponseTypes";

const HomePage = async () => {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has("accessToken");

  const user: AuthUser | null = hasAccessToken
    ? (await getMeQuery()).data.user
    : null;

  // Fetch top categories (doesn't require auth)
  const topCategoriesRes = await getTopCategoriesQuery();

  // Fetch featured courses (doesn't require auth)
  const featuredCoursesRes = await getFeaturedCoursesQuery();

  // Fetch trending courses (doesn't require auth)
  const trendingCoursesRes = await getTrendingCoursesQuery();

  return (
    <Home
      user={user}
      topCategories={topCategoriesRes.data.categories}
      featuredCourses={featuredCoursesRes.data.courses}
      trendingCourses={trendingCoursesRes.data.courses}
    />
  );
};

export default HomePage;
