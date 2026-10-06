"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { REVIEW_TAGS } from "./tags";
import type {
  CreateReviewResponse,
  UpdateReviewResponse,
  DeleteReviewResponse,
} from "@/response-types/reviewResponseTypes";

/**
 * Student only. Course must have an enrollment for the caller, and a
 * student may leave exactly one review per course. `instructor` is derived
 * server-side from the course — do not send it.
 */
export async function createReviewAction(data: {
  course: string;
  rating: number;
  feedback: string;
}): Promise<CreateReviewResponse> {
  const res = await apiClient("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: CreateReviewResponse = await res.json();

  if (json.status === "success") {
    updateTag(REVIEW_TAGS.reviews);
    updateTag(REVIEW_TAGS.reviewByCourse(data.course));
    updateTag(REVIEW_TAGS.reviewsByCourse(data.course));
  }

  return json;
}

/**
 * Student only, and only the review's own author. All fields are optional,
 * but at least one must be sent.
 */
export async function updateReviewAction(
  id: string,
  data: {
    rating?: number;
    feedback?: string;
  },
): Promise<UpdateReviewResponse> {
  const res = await apiClient(`/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateReviewResponse = await res.json();

  if (json.status === "success") {
    updateTag(REVIEW_TAGS.reviews);
    updateTag(REVIEW_TAGS.reviewDetails(id));
  }

  return json;
}

/**
 * Open to any authenticated role — the review's own author, or an Admin.
 */
export async function deleteReviewAction(
  id: string,
): Promise<DeleteReviewResponse> {
  const res = await apiClient(`/reviews/${id}`, {
    method: "DELETE",
  });

  const json: DeleteReviewResponse = await res.json();

  if (json.status === "success") {
    updateTag(REVIEW_TAGS.reviews);
    updateTag(REVIEW_TAGS.reviewDetails(id));
  }

  return json;
}
