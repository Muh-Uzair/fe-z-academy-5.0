export const USER_TAGS = {
  instructors: "instructors",
  students: "students",
  userDetails: (id: string) => `user-details-${id}`,
  profile: "profile",
} as const;
