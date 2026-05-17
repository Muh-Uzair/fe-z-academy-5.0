import { CourseLevel, type Course } from "@/types/courseTypes";

export interface CourseCategoryOption {
  _id: string;
  name: string;
}

export interface CourseRecord extends Course {
  categoryName: string;
  instructorName: string;
}

export const courseCategoryOptions: CourseCategoryOption[] = [
  {
    _id: "cat_001",
    name: "Web Development",
  },
  {
    _id: "cat_002",
    name: "Mobile App Development",
  },
  {
    _id: "cat_003",
    name: "Data Science",
  },
];

export const courseMockData: CourseRecord[] = [
  {
    _id: "course_001",
    title: "Modern React Foundations",
    description:
      "Build production-ready React applications with components, state, hooks, routing, and polished UI implementation patterns for real student projects.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    price: 49,
    level: CourseLevel.Beginner,
    instructor: "user_001",
    instructorName: "Muhammad Uzair",
    category: "cat_001",
    categoryName: "Web Development",
    isVerified: false,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 84,
    totalStudentsEnrolled: 230,
    totalDurationInMinutes: 420,
    createdAt: "2026-05-10T09:30:00Z",
    updatedAt: "2026-05-15T13:45:00Z",
  },
  {
    _id: "course_002",
    title: "Advanced Node API Architecture",
    description:
      "Learn how to design scalable backend services with modular architecture, validation, authentication, file handling, and deployment-ready API patterns.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    price: 79,
    level: CourseLevel.Advanced,
    instructor: "user_001",
    instructorName: "Muhammad Uzair",
    category: "cat_001",
    categoryName: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.9,
    totalReviews: 121,
    totalStudentsEnrolled: 412,
    totalDurationInMinutes: 610,
    createdAt: "2026-04-22T08:15:00Z",
    updatedAt: "2026-05-14T16:20:00Z",
  },
  {
    _id: "course_003",
    title: "Intro to Applied Data Analysis",
    description:
      "Understand data cleaning, visualization, and exploratory analysis with practical workflows that help beginners build confidence with datasets.",
    thumbnail:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    price: 59,
    level: CourseLevel.Intermediate,
    instructor: "user_001",
    instructorName: "Muhammad Uzair",
    category: "cat_003",
    categoryName: "Data Science",
    isVerified: false,
    verificationRejectionReason:
      "Please replace the thumbnail and expand the course description with clearer learning outcomes before resubmitting.",
    averageRating: 0,
    totalReviews: 0,
    totalStudentsEnrolled: 0,
    totalDurationInMinutes: 300,
    createdAt: "2026-05-01T11:00:00Z",
    updatedAt: "2026-05-12T10:10:00Z",
  },
];
