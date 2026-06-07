import type { CourseLevel, CourseRecord } from "@/types/courseTypes";

export type CourseVerificationState = "verified" | "pending" | "rejected";

export const getCourseVerificationState = (
  course: Pick<CourseRecord, "isVerified" | "verificationRejectionReason">,
): CourseVerificationState => {
  if (course.isVerified && !course.verificationRejectionReason) {
    return "verified";
  }

  if (!course.isVerified && course.verificationRejectionReason) {
    return "rejected";
  }

  return "pending";
};

export const getCourseVerificationLabel = (
  course: Pick<CourseRecord, "isVerified" | "verificationRejectionReason">,
  variant: "detailed" | "simple" = "detailed",
) => {
  if (variant === "simple") {
    return course.isVerified ? "Verified" : "Not Verified";
  }

  const state = getCourseVerificationState(course);

  if (state === "verified") {
    return "Approved";
  }

  if (state === "rejected") {
    return "Rejected";
  }

  return "Pending Review";
};

export const getCourseVerificationBadgeVariant = (
  course: Pick<CourseRecord, "isVerified" | "verificationRejectionReason">,
) => {
  const state = getCourseVerificationState(course);

  if (state === "verified") {
    return "default" as const;
  }

  if (state === "rejected") {
    return "destructive" as const;
  }

  return "secondary" as const;
};

export const formatCourseLevel = (level: CourseLevel | string) =>
  level.charAt(0).toUpperCase() + level.slice(1);

export const truncateText = (value: string | null, maxLength: number) => {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
};
