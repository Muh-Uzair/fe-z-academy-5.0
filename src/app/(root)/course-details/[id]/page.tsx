"use client";

import { useSearchParams } from "next/navigation";
import CourseDetails, { CourseViewerRole } from "@/features/course-management/CourseDetails";

const UnifiedCourseDetailsPage = () => {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as CourseViewerRole) || "student";

  return <CourseDetails viewerRole={role} />;
};

export default UnifiedCourseDetailsPage;
