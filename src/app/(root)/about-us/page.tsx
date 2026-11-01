import AboutUs from "@/features/course-management/AboutUs";
import { getPlatformStatsQuery } from "@/services/stat/queries";

const AboutUsPage = async () => {
  const platformStatsRes = await getPlatformStatsQuery();

  return <AboutUs platformStats={platformStatsRes.data} />;
};

export default AboutUsPage;
