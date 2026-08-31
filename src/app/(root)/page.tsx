import { cookies } from "next/headers";

import Home from "@/features/course-management/Home";
import { getMeQuery } from "@/services/auth/queries";
import type { AuthUser } from "@/response-types/authResponseTypes";

const HomePage = async () => {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has("accessToken");

  const user: AuthUser | null = hasAccessToken
    ? (await getMeQuery()).data.user
    : null;

  return <Home user={user} />;
};

export default HomePage;
