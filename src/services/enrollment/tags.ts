export const ENROLLMENT_TAGS = {
  enrollments: "enrollments",
  enrollmentDetails: (id: string) => `enrollment-details-${id}`,
} as const;
