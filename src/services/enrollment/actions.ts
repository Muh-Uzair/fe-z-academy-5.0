"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { ENROLLMENT_TAGS } from "./tags";
import type {
  UpdateEnrollmentProgressRequestBody,
  UpdateEnrollmentProgressResponse,
} from "@/response-types/enrollmentResponseTypes";

/**
 * Only the enrolled student may update their own enrollment's progress
 * (403 otherwise, including for Admin/Instructor). The backend tracks the
 * furthest position ever reached — sending a smaller `lastPositionInSeconds`
 * never lowers `watchPercentage`.
 */
export async function updateEnrollmentProgressAction(
  id: string,
  data: UpdateEnrollmentProgressRequestBody,
): Promise<UpdateEnrollmentProgressResponse> {
  const res = await apiClient(`/enrollments/${id}/progress`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateEnrollmentProgressResponse = await res.json();

  if (json.status === "success") {
    updateTag(ENROLLMENT_TAGS.enrollments);
    updateTag(ENROLLMENT_TAGS.enrollmentDetails(id));
  }

  return json;
}
