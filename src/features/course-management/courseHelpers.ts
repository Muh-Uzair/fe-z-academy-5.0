import { CourseLevel } from "@/response-types/courseResponseTypes";
import type { CourseListItem as CourseRecord } from "@/response-types/courseResponseTypes";

export type CourseVerificationState = "verified" | "pending" | "rejected";

// isVerified: true                                        -> verified
// isVerified: false && verificationRejectionReason == null -> pending
// isVerified: false && verificationRejectionReason != null -> rejected
export const getCourseVerificationState = (
  course: Pick<CourseRecord, "isVerified" | "verificationRejectionReason">,
): CourseVerificationState => {
  if (course.isVerified) {
    return "verified";
  }

  if (course.verificationRejectionReason) {
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
    return "Verified";
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

// The backend never inspects the uploaded video file itself, so
// totalDurationInMinutes (required on create, and on update whenever a new
// videoKey is sent) must be read from the file client-side before calling
// createCourseAction/updateCourseAction.
export const getVideoDurationInMinutes = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number((video.duration / 60).toFixed(2)));
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the video file's duration."));
    };

    video.src = objectUrl;
  });

export const truncateText = (value: string | null, maxLength: number) => {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
};
