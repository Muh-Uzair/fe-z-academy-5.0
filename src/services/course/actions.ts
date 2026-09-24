"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { COURSE_TAGS } from "./tags";
import type {
  UploadCourseThumbnailResponse,
  UploadCourseVideoResponse,
  CreateCourseResponse,
  UpdateCourseResponse,
  DeleteCourseResponse,
  UpdateCourseVerificationResponse,
  CreateCoursePaymentIntentResponse,
  RequestCourseRefundResponse,
} from "@/response-types/courseResponseTypes";
import { CourseLevel } from "@/response-types/courseResponseTypes";

/**
 * Instructor only. Generates a presigned S3 POST policy for uploading a
 * course thumbnail directly from the browser. Max file size 5 MB. Upload the
 * file to `data.uploadUrl` using `data.fields`, then send `data.key` as
 * `thumbnailKey` to createCourseAction or updateCourseAction.
 */
export async function uploadCourseThumbnailAction(data: {
  fileName: string;
  fileType: "image/jpeg" | "image/png";
}): Promise<UploadCourseThumbnailResponse> {
  const res = await apiClient("/courses/upload-thumbnail", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}

/**
 * Instructor only. Generates a presigned S3 POST policy for uploading a
 * course video directly from the browser. Max file size 20 MB. Upload the
 * file to `data.uploadUrl` using `data.fields`, then send `data.key` as
 * `videoKey` to createCourseAction or updateCourseAction.
 */
export async function uploadCourseVideoAction(data: {
  fileName: string;
  fileType: "video/mp4" | "video/webm";
}): Promise<UploadCourseVideoResponse> {
  const res = await apiClient("/courses/upload-video", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}

/**
 * Instructor only. Requires the instructor to have completed Stripe Connect
 * onboarding. `thumbnailKey`/`videoKey` must come from
 * uploadCourseThumbnailAction/uploadCourseVideoAction. New courses always
 * start with `isVerified: false`, pending admin review.
 * `totalDurationInMinutes` must be read from the actual video file on the
 * frontend (e.g. an `HTMLVideoElement`'s `.duration`, converted to minutes)
 * before calling this — the backend never inspects the uploaded file itself.
 */
export async function createCourseAction(data: {
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  category: string;
  thumbnailKey: string;
  videoKey: string;
  totalDurationInMinutes: number;
}): Promise<CreateCourseResponse> {
  const res = await apiClient("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: CreateCourseResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.featuredCourses);
  }

  return json;
}

/**
 * Instructor only, and only the course's own instructor. All fields are
 * optional, but at least one must be sent. If `thumbnailKey`/`videoKey`
 * changes, the previous S3 object is deleted by the backend.
 * `totalDurationInMinutes` is required whenever `videoKey` is sent (must be
 * read from the actual video file on the frontend, same as
 * createCourseAction) — omit it otherwise.
 */
export async function updateCourseAction(
  id: string,
  data: {
    title?: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
    totalDurationInMinutes?: number;
    price?: number;
    level?: CourseLevel;
    category?: string;
  },
): Promise<UpdateCourseResponse> {
  const res = await apiClient(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateCourseResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
  }

  return json;
}

/**
 * Instructor only, and only the course's own instructor. Deletes the course
 * document and both its S3 objects (thumbnail + video).
 */
export async function deleteCourseAction(
  id: string,
): Promise<DeleteCourseResponse> {
  const res = await apiClient(`/courses/${id}`, {
    method: "DELETE",
  });

  const json: DeleteCourseResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
  }

  return json;
}

/**
 * Admin only. Approves or rejects a course. `verificationRejectionReason` is
 * required when `isVerified` is `false`. Rejecting redundantly (course is
 * already in the target state) is rejected with an error.
 */
export async function updateCourseVerificationAction(
  id: string,
  data: {
    isVerified: boolean;
    verificationRejectionReason?: string;
  },
): Promise<UpdateCourseVerificationResponse> {
  const res = await apiClient(`/courses/${id}/verification`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateCourseVerificationResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
  }

  return json;
}

/**
 * Student only. Course must be verified, the student must not already be
 * enrolled, and the course's instructor must have completed Stripe
 * onboarding. Pass `data.clientSecret` to Stripe.js/Elements on the frontend
 * to confirm the payment.
 */
export async function createCoursePaymentIntentAction(
  id: string,
): Promise<CreateCoursePaymentIntentResponse> {
  const res = await apiClient(`/courses/${id}/payment-intent`, {
    method: "POST",
  });

  const json: CreateCoursePaymentIntentResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.courseDetails(id));
  }

  return json;
}

/**
 * Student only. Refund window is 7 days from the payment date, and is
 * blocked once the student has watched more than 30% of the course. A
 * duplicate/double-click request for the same course is rejected outright
 * with "A refund for this course is already being processed". The
 * transaction is claimed (paymentStatus -> "refund_processing") immediately
 * on success, so the eligibility check is invalidated — but enrollment
 * removal itself happens asynchronously via a Stripe webhook, so no
 * course/enrollment tag is invalidated here.
 */
export async function requestCourseRefundAction(
  id: string,
): Promise<RequestCourseRefundResponse> {
  const res = await apiClient(`/courses/${id}/refund`, {
    method: "POST",
  });

  const json: RequestCourseRefundResponse = await res.json();

  if (json.status === "success") {
    updateTag(COURSE_TAGS.refundEligibility(id));
  }

  return json;
}
