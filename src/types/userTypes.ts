export enum Role {
  Admin = "admin",
  Instructor = "instructor",
  Student = "student",
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  highestEducation: string;
  yearsOfExperience?: number;
  avatar?: string | null;
  isVerified: boolean;
  verificationRejectionReason: string | null;
  otp?: string | null;
  otpExpires?: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
}
