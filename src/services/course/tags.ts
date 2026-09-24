export const COURSE_TAGS = {
  courses: "courses",
  courseDetails: (id: string) => `course-details-${id}`,
  completionStatus: (id: string) => `course-completion-status-${id}`,
  refundEligibility: (id: string) => `course-refund-eligibility-${id}`,
  publicCourses: "public-courses",
  publicCourseDetails: (id: string) => `public-course-details-${id}`,
  featuredCourses: "featured-courses",
  trendingCourses: "trending-courses",
} as const;
