import AboutUs from "@/features/course-management/AboutUs";
import { getPlatformStatsQuery } from "@/services/stat/queries";

const defaultStats = { totalStudents: 0, totalCourses: 0 };

const AboutUsPage = async () => {
  let stats = defaultStats;
  try {
    const platformStatsRes = await getPlatformStatsQuery();
    stats = platformStatsRes.data;
  } catch {
    // Fallback to default stats if API is unavailable during build/offline
  }

  return <AboutUs platformStats={stats} />;
};

export default AboutUsPage;
