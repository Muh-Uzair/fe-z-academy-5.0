export const REVIEW_TAGS = {
  reviews: "reviews",
  reviewDetails: (id: string) => `review-details-${id}`,
  reviewByCourse: (courseId: string) => `review-by-course-${courseId}`,
  reviewsByCourse: (courseId: string) => `reviews-by-course-${courseId}`,
} as const;
