export enum CourseLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export interface Course {
  _id: string;

  title: string;

  description: string;

  thumbnail: string;

  videoUrl: string;

  price: number;

  level: CourseLevel;

  instructor: string;

  category: string;

  isVerified: boolean;

  verificationRejectionReason: string | null;

  averageRating: number;

  totalReviews: number;

  totalStudentsEnrolled: number;

  totalDurationInMinutes: number;

  totalDurationWatchedInMinutes: number;

  watchPercentage: number;

  mostRecentlySeen: boolean;

  createdAt: string;

  updatedAt: string;
}
