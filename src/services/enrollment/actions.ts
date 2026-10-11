"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { ENROLLMENT_TAGS } from "./tags";
import { COURSE_TAGS } from "@/services/course/tags";
import { TRANSACTION_TAGS } from "@/services/transaction/tags";
import { STAT_TAGS } from "@/services/stat/tags";
import { DASHBOARD_TAGS } from "@/services/dashboard/tags";
import { USER_TAGS } from "@/services/user/tags";
import { REVIEW_TAGS } from "@/services/review/tags";
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
  courseId?: string,
): Promise<UpdateEnrollmentProgressResponse> {
  const res = await apiClient(`/enrollments/${id}/progress`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateEnrollmentProgressResponse = await res.json();

  if (json.status === "success") {
    // 1. Invalidate enrollment tags
    updateTag(ENROLLMENT_TAGS.enrollments);
    updateTag(ENROLLMENT_TAGS.enrollmentDetails(id));

    // 2. Invalidate course refund eligibility and completion status
    const targetCourseId = courseId || json.data?.enrollment?.course;
    if (targetCourseId) {
      updateTag(COURSE_TAGS.refundEligibility(targetCourseId));
      updateTag(COURSE_TAGS.completionStatus(targetCourseId));
    }

    // 3. Invalidate student progress and instructor avgCompletion in dashboards.
    // Admin dashboard topPerformingCourses also reflects enrollment activity.
    updateTag(DASHBOARD_TAGS.student);
    updateTag(DASHBOARD_TAGS.instructor);
    updateTag(DASHBOARD_TAGS.admin);
  }

  return json;
}

/**
 * Called after the Stripe charge.refunded webhook has been processed by the
 * backend. At that point the enrollment is removed, the student's review for
 * the course is deleted, course stats (totalStudentsEnrolled, averageRating,
 * totalReviews) are decremented, and the transaction flips to "refunded".
 * Invalidate everything that was intentionally deferred from
 * requestCourseRefundAction.
 */
export async function revalidateAfterRefundWebhookAction(
  courseId: string,
): Promise<{ status: "success"; message: string }> {
  // 1. Enrollment removed
  updateTag(ENROLLMENT_TAGS.enrollments);
  updateTag(USER_TAGS.instructors);
  updateTag(USER_TAGS.students);

  // 2. Transaction flipped to "refunded"
  updateTag(TRANSACTION_TAGS.transactions);

  // 3. Course stats decremented (totalStudentsEnrolled, averageRating, totalReviews)
  updateTag(COURSE_TAGS.courses);
  updateTag(COURSE_TAGS.publicCourses);
  updateTag(COURSE_TAGS.featuredCourses);
  updateTag(COURSE_TAGS.trendingCourses);
  updateTag(COURSE_TAGS.courseDetails(courseId));
  updateTag(COURSE_TAGS.publicCourseDetails(courseId));
  updateTag(COURSE_TAGS.completionStatus(courseId));

  // 4. Review deleted — course rating recalculated
  updateTag(REVIEW_TAGS.reviews);
  updateTag(REVIEW_TAGS.reviewByCourse(courseId));
  updateTag(REVIEW_TAGS.reviewsByCourse(courseId));

  // 5. Platform stats and all dashboards
  updateTag(STAT_TAGS.platformStats);
  updateTag(DASHBOARD_TAGS.admin);
  updateTag(DASHBOARD_TAGS.instructor);
  updateTag(DASHBOARD_TAGS.student);

  return { status: "success", message: "Refund webhook revalidation complete" };
}

export async function revalidateEnrollmentAfterPaymentAction(
  courseId?: string,
): Promise<{
  status: "success";
  message: string;
}> {
  // 1. Invalidate enrollment tags so /enrolled-courses displays the new course
  updateTag(ENROLLMENT_TAGS.enrollments);
  updateTag(USER_TAGS.instructors);
  updateTag(USER_TAGS.students);

  // 2. Invalidate transaction tags so transactions list shows the new purchase
  updateTag(TRANSACTION_TAGS.transactions);

  // 3. Invalidate student courses and course details
  updateTag(COURSE_TAGS.courses);
  updateTag(COURSE_TAGS.publicCourses);
  updateTag(COURSE_TAGS.trendingCourses);
  if (courseId) {
    updateTag(COURSE_TAGS.courseDetails(courseId));
    updateTag(COURSE_TAGS.publicCourseDetails(courseId));
    updateTag(COURSE_TAGS.completionStatus(courseId));
    updateTag(COURSE_TAGS.refundEligibility(courseId));
  }

  // 4. Invalidate platform stats
  updateTag(STAT_TAGS.platformStats);

  // 5. Invalidate all dashboards (new revenue, enrollments, transaction)
  updateTag(DASHBOARD_TAGS.admin);
  updateTag(DASHBOARD_TAGS.instructor);
  updateTag(DASHBOARD_TAGS.student);

  return {
    status: "success",
    message: "Enrollments and transactions revalidated successfully",
  };
}
