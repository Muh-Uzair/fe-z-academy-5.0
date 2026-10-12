"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { COURSE_TAGS } from "./tags";
import { STAT_TAGS } from "@/services/stat/tags";
import { CATEGORY_TAGS } from "@/services/category/tags";
import { DASHBOARD_TAGS } from "@/services/dashboard/tags";

import { TRANSACTION_TAGS } from "@/services/transaction/tags";
import { ENROLLMENT_TAGS } from "@/services/enrollment/tags";
import { REVIEW_TAGS } from "@/services/review/tags";
import { USER_TAGS } from "@/services/user/tags";
import type {
  UploadCourseThumbnailResponse,
  UploadCourseVideoResponse,
  CreateCourseResponse,
  UpdateCourseResponse,
  DeleteCourseResponse,
  UpdateCourseVerificationResponse,
  CreateCoursePaymentIntentResponse,
  RequestCourseRefundResponse,
  IssueCourseCertificateResponse,
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
    // New courses start unverified, so the public, featured and trending
    // lists don't change — only the role-scoped course lists do.
    updateTag(COURSE_TAGS.courses);
    // Course added to category
    updateTag(CATEGORY_TAGS.topCategories);
    // Course totals appear in admin and instructor dashboards.
    updateTag(DASHBOARD_TAGS.admin);
    updateTag(DASHBOARD_TAGS.instructor);
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
    updateTag(COURSE_TAGS.publicCourses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.trendingCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
    updateTag(COURSE_TAGS.publicCourseDetails(id));
    if (data.category) {
      updateTag(CATEGORY_TAGS.topCategories);
    }
    // Enrollments, transactions, and reviews all embed courseDetails/courseTitle
    // — title, price, thumbnailUrl changes must bust those caches too.
    updateTag(ENROLLMENT_TAGS.enrollments);
    updateTag(TRANSACTION_TAGS.transactions);
    updateTag(REVIEW_TAGS.reviews);
    // Per-course review caches also embed courseDetails — bust them too.
    updateTag(REVIEW_TAGS.reviewByCourse(id));
    updateTag(REVIEW_TAGS.reviewsByCourse(id));
    // Student dashboard continueWatching embeds course title and thumbnailUrl.
    updateTag(DASHBOARD_TAGS.admin);
    updateTag(DASHBOARD_TAGS.instructor);
    updateTag(DASHBOARD_TAGS.student);
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
    updateTag(COURSE_TAGS.publicCourses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.trendingCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
    updateTag(COURSE_TAGS.publicCourseDetails(id));
    // totalCourses stat changes when a verified course is deleted
    updateTag(STAT_TAGS.platformStats);
    // category course count changes when a course is deleted
    updateTag(CATEGORY_TAGS.topCategories);
    // Deleting is blocked while students are enrolled, so no enrollment or
    // review of this course can exist — but past (refunded) transactions still
    // embed courseDetails.
    updateTag(TRANSACTION_TAGS.transactions);
    // Admin/instructor totalCourses, and the student's recent transactions
    // (courseTitle) change.
    updateTag(DASHBOARD_TAGS.admin);
    updateTag(DASHBOARD_TAGS.instructor);
    updateTag(DASHBOARD_TAGS.student);
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
    updateTag(COURSE_TAGS.publicCourses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.trendingCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
    updateTag(COURSE_TAGS.publicCourseDetails(id));
    // totalCourses stat counts verified courses only, so it changes here.
    // topCategories counts all courses regardless of verification, so it
    // doesn't.
    updateTag(STAT_TAGS.platformStats);
    // Enrollments and transactions embed courseDetails (isVerified, verificationRejectionReason).
    updateTag(ENROLLMENT_TAGS.enrollments);
    updateTag(TRANSACTION_TAGS.transactions);
    // Reviews embed courseDetails (isVerified field).
    updateTag(REVIEW_TAGS.reviews);
    updateTag(REVIEW_TAGS.reviewByCourse(id));
    updateTag(REVIEW_TAGS.reviewsByCourse(id));
    // Only the instructor dashboard shows a course's verification state
    // (coursePerformance.isVerified). The admin dashboard counts courses
    // regardless of verification, and the student dashboard doesn't show it.
    updateTag(DASHBOARD_TAGS.instructor);
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
    // The backend records a pending transaction when the PaymentIntent is
    // created, and it appears in the transactions lists and in the student
    // dashboard's recentTransactions.
    updateTag(TRANSACTION_TAGS.transactions);
    updateTag(DASHBOARD_TAGS.student);
  }

  // Enrollment and course stats are only updated after the Stripe
  // payment_intent.succeeded webhook fires. Call
  // revalidateEnrollmentAfterPaymentAction (enrollment/actions.ts) once the
  // client-side payment confirmation succeeds.

  return json;
}

/**
 * Student only. Refund window is 7 days from the payment date, and is
 * blocked once the student has watched more than 30% of the course. A
 * duplicate/double-click request for the same course is rejected outright
 * with "A refund for this course is already being processed". On success,
 * invalidates refund eligibility, courses list, course details, completion
 * status, transactions, enrollments, reviews, and platform stats/dashboards.
 */
export async function requestCourseRefundAction(
  id: string,
): Promise<RequestCourseRefundResponse> {
  const res = await apiClient(`/courses/${id}/refund`, {
    method: "POST",
  });

  const json: RequestCourseRefundResponse = await res.json();

  if (json.status === "success") {
    // The backend sets the transaction to "refund_processing" synchronously.
    // Enrollment removal, review cleanup, and the final "refunded" status flip
    // happen asynchronously via the Stripe charge.refunded webhook, but per
    // project convention (conventions.md) refund-related invalidation runs
    // eagerly here. The minutes cache profile absorbs the brief async gap.

    // 1. Course tags
    updateTag(COURSE_TAGS.refundEligibility(id));
    updateTag(COURSE_TAGS.courses);
    updateTag(COURSE_TAGS.publicCourses);
    updateTag(COURSE_TAGS.courseDetails(id));
    updateTag(COURSE_TAGS.completionStatus(id));
    updateTag(COURSE_TAGS.trendingCourses);
    updateTag(COURSE_TAGS.featuredCourses);
    updateTag(COURSE_TAGS.publicCourseDetails(id));

    // 2. Transaction status changed to "refund_processing"
    updateTag(TRANSACTION_TAGS.transactions);

    // 3. Enrollment & review cleanup (async via webhook, invalidated eagerly)
    updateTag(ENROLLMENT_TAGS.enrollments);
    updateTag(USER_TAGS.instructors);
    updateTag(USER_TAGS.students);
    updateTag(REVIEW_TAGS.reviewByCourse(id));
    updateTag(REVIEW_TAGS.reviewsByCourse(id));
    updateTag(REVIEW_TAGS.reviews);

    // 4. Platform stats & dashboards
    updateTag(STAT_TAGS.platformStats);
    updateTag(DASHBOARD_TAGS.admin);
    updateTag(DASHBOARD_TAGS.instructor);
    updateTag(DASHBOARD_TAGS.student);
  }

  return json;
}

/**
 * Student only. Generates or retrieves the certificate of completion for an
 * enrolled course where the student has completed the course (watched >= 95%).
 * Uncached action that requests fresh certificate data directly from the server.
 */
export async function issueCourseCertificateAction(
  id: string,
): Promise<IssueCourseCertificateResponse> {
  const res = await apiClient(`/courses/${id}/issue-certificate`, {
    method: "GET",
  });

  const json: IssueCourseCertificateResponse = await res.json();

  if (json.status === "success") {
    // Enrollments carry certificateIssued/certificateIssuedAt and every
    // enrollments page filters on it.
    updateTag(ENROLLMENT_TAGS.enrollments);
  }

  return json;
}
