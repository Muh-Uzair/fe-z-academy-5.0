export enum Role {
  Admin = "admin",
  Instructor = "instructor",
  Student = "student",
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  highestEducation: string;
  yearsOfExperience: number;
  avatar: string | null;
  isVerified: boolean;
  verificationRejectionReason: string | null;
  role: Role | string;
  createdAt: string;
  updatedAt: string;
}
