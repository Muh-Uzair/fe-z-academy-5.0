"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { USER_TAGS } from "./tags";
import { AUTH_TAGS } from "../auth/tags";
import { DASHBOARD_TAGS } from "../dashboard/tags";
import { ENROLLMENT_TAGS } from "@/services/enrollment/tags";
import { TRANSACTION_TAGS } from "@/services/transaction/tags";
import { REVIEW_TAGS } from "@/services/review/tags";
import { COURSE_TAGS } from "@/services/course/tags";
import type {
  GetInstructorOnboardingLinkResponse,
  UpdateUserVerificationResponse,
  UpdateProfileResponse,
  UploadAvatarResponse,
} from "@/response-types/userResponseTypes";

/**
 * Admin only. Approves or rejects a student or instructor account's
 * verification.
 */
export async function updateUserVerificationAction(
  id: string,
  role: "student" | "instructor" | "admin" | undefined,
  data: {
    isVerified: boolean;
    verificationRejectionReason?: string;
  },
): Promise<UpdateUserVerificationResponse> {
  const query = role ? `?role=${role}` : "";
  const res = await apiClient(`/users/user/${id}/verification${query}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateUserVerificationResponse = await res.json();

  // Verification status changed — refresh the corresponding user list,
  // this user's detail view, and the admin dashboard recent users.
  if (json.status === "success") {
    if (role === "student") {
      updateTag(USER_TAGS.students);
    } else if (role === "instructor") {
      updateTag(USER_TAGS.instructors);
    } else {
      updateTag(USER_TAGS.students);
      updateTag(USER_TAGS.instructors);
    }
    updateTag(USER_TAGS.userDetails(id));
    updateTag(DASHBOARD_TAGS.admin);
  }

  return json;
}

/**
 * Any authenticated user. Updates the signed-in user's own profile.
 * Only the fields provided are sent — omit fields you don't want to change.
 */
export async function updateProfileAction(data: {
  fullName?: string;
  avatarKey?: string | null;
  bio?: string;
  highestEducation?: string;
  yearsOfExperience?: number;
}): Promise<UpdateProfileResponse> {
  const res = await apiClient("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateProfileResponse = await res.json();

  // Profile fields overlap with cached user details, role lists, dashboards,
  // and every resource that embeds user summaries (enrollments, transactions,
  // reviews embed studentDetails / instructorDetails / reviewByDetails).
  if (json.status === "success") {
    const user = json.data.user;
    updateTag(AUTH_TAGS.currentUser);
    updateTag(USER_TAGS.profile);
    updateTag(USER_TAGS.userDetails(user._id));
    if (user.role === "student") {
      updateTag(USER_TAGS.students);
      // Enrollments embed studentDetails; transactions embed studentDetails.
      updateTag(ENROLLMENT_TAGS.enrollments);
      updateTag(TRANSACTION_TAGS.transactions);
      // Reviews embed reviewByDetails (student).
      updateTag(REVIEW_TAGS.reviews);
      // Admin recentUsers; instructor recentReviews (studentName/avatar). The
      // student dashboard doesn't show the student's own profile.
      updateTag(DASHBOARD_TAGS.admin);
      updateTag(DASHBOARD_TAGS.instructor);
    } else if (user.role === "instructor") {
      updateTag(USER_TAGS.instructors);
      // Enrollments embed instructorDetails; transactions embed instructorDetails.
      updateTag(ENROLLMENT_TAGS.enrollments);
      updateTag(TRANSACTION_TAGS.transactions);
      // Reviews embed instructorDetails.
      updateTag(REVIEW_TAGS.reviews);
      // Course list/detail embed instructorDetails.
      updateTag(COURSE_TAGS.courses);
      updateTag(COURSE_TAGS.publicCourses);
      updateTag(COURSE_TAGS.featuredCourses);
      updateTag(COURSE_TAGS.trendingCourses);
      // Admin recentUsers and top courses (instructorName); student dashboard
      // (instructorName/avatar). The instructor dashboard doesn't show the
      // instructor's own profile.
      updateTag(DASHBOARD_TAGS.admin);
      updateTag(DASHBOARD_TAGS.student);
    } else {
      // Admins only appear in the admin dashboard's recentUsers.
      updateTag(DASHBOARD_TAGS.admin);
    }
  }

  return json;
}

/**
 * Instructor only. Generates a fresh Stripe Express onboarding URL.
 * This is an action because the URL is requested from a client-side button
 * and must never be cached or reused.
 */
export async function getInstructorOnboardingLinkAction(): Promise<GetInstructorOnboardingLinkResponse> {
  const res = await apiClient("/users/get-instructor-onboarding-link", {
    method: "GET",
  });

  return res.json() as Promise<GetInstructorOnboardingLinkResponse>;
}

/**
 * Any authenticated user. Generates a presigned URL for direct-to-S3 avatar upload.
 */
export async function uploadAvatarAction(data: {
  fileName: string;
  fileType: "image/jpeg" | "image/png";
}): Promise<UploadAvatarResponse> {
  const res = await apiClient("/users/profile/upload-avatar", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json() as Promise<UploadAvatarResponse>;
}
