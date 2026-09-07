export const COURSE_TAGS = {
  courses: "courses",
  courseDetails: (id: string) => `course-details-${id}`,
  completionStatus: (id: string) => `course-completion-status-${id}`,
  publicCourses: "public-courses",
  publicCourseDetails: (id: string) => `public-course-details-${id}`,
} as const;
