export const REVIEW_TAGS = {
  reviews: "reviews",
  reviewDetails: (id: string) => `review-details-${id}`,
  myReviews: "my-reviews",
  reviewByCourse: (courseId: string) => `review-by-course-${courseId}`,
} as const;
