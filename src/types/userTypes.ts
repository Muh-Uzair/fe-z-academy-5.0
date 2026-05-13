export enum Role {
  Admin = "admin",
  Instructor = "instructor",
  Student = "student",
}

export interface UserInterface {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  highestEducation: string;
  yearsOfExperience?: number;
  avatar?: string | null;
  isVerified: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role; 
}
