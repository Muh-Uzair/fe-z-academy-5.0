"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { ENROLLMENT_TAGS } from "./tags";
import { COURSE_TAGS } from "@/services/course/tags";
import { TRANSACTION_TAGS } from "@/services/transaction/tags";
import { STAT_TAGS } from "@/services/stat/tags";
import { DASHBOARD_TAGS } from "@/services/dashboard/tags";
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

    // 3. Invalidate student progress and instructor avgCompletion in dashboards
    updateTag(DASHBOARD_TAGS.student);
    updateTag(DASHBOARD_TAGS.instructor);
  }

  return json;
}

/**
 * Student only. Invalidates enrollments, transactions, course access, and
 * platform stats cache tags after a successful Stripe payment on the client.
 */
export async function revalidateEnrollmentAfterPaymentAction(
  courseId?: string,
): Promise<{
  status: "success";
  message: string;
}> {
  // 1. Invalidate enrollment tags so /enrolled-courses displays the new course
  updateTag(ENROLLMENT_TAGS.enrollments);

  // 2. Invalidate transaction tags so transactions list shows the new purchase
  updateTag(TRANSACTION_TAGS.transactions);

  // 3. Invalidate student courses and course details
  updateTag(COURSE_TAGS.courses);
  updateTag(COURSE_TAGS.publicCourses);
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
