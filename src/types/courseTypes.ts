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
  level: CourseLevel | string;
  instructor: string;
  category: string;
  isVerified: boolean;
  verificationRejectionReason: string | null;
  averageRating: number;
  totalReviews: number;
  totalStudentsEnrolled: number;
  totalDurationInMinutes: number;
  totalRevenueInstructor: number;
  totalRevenueAdmin: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// A helper type for UI where category and instructor details are populated
export interface CourseRecord extends Course {
  categoryName: string;
  instructorName: string;
}
