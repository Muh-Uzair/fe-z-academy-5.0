export const COURSE_TAGS = {
  courses: "courses",
  courseDetails: (id: string) => `course-details-${id}`,
  completionStatus: (id: string) => `course-completion-status-${id}`,
} as const;
