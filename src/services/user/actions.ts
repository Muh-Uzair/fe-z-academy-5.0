"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { USER_TAGS } from "./tags";
import { AUTH_TAGS } from "../auth/tags";
import type {
  UpdateUserVerificationResponse,
  UpdateProfileResponse,
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

  // Verification status changed — refresh the instructors list and this
  // user's own detail view.
  if (json.status === "success") {
    updateTag(USER_TAGS.instructors);
    updateTag(USER_TAGS.userDetails(id));
  }

  return json;
}

/**
 * Any authenticated user. Updates the signed-in user's own profile.
 * Only the fields provided are sent — omit fields you don't want to change.
 */
export async function updateProfileAction(data: {
  fullName?: string;
  avatar?: string | null;
  bio?: string;
  highestEducation?: string;
  yearsOfExperience?: number;
}): Promise<UpdateProfileResponse> {
  const res = await apiClient("/users/update-profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateProfileResponse = await res.json();

  // Profile fields overlap with the cached current-user session data —
  // invalidate it so the next getMeQuery() call reflects the update.
  if (json.status === "success") {
    updateTag(AUTH_TAGS.currentUser);
  }

  return json;
}
