import CourseDetails, {
  type CourseViewerRole,
} from "@/features/course-management/CourseDetails";
import {
  getCourseDetailsQuery,
  getPublicCourseDetailsQuery,
  getCourseRefundEligibilityQuery,
} from "@/services/course/queries";
import { getCategoriesQuery } from "@/services/category/queries";
import { getEnrollmentsQuery } from "@/services/enrollment/queries";
import type { CourseRefundEligibility } from "@/response-types/courseResponseTypes";
import { getReviewsByCourseIdQuery } from "@/services/review/queries";

type CourseDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    role?: string;
    source?: string;
    categorySearch?: string;
    categoryPage?: string;
  }>;
};

const UnifiedCourseDetailsPage = async ({
  params,
  searchParams,
}: CourseDetailsPageProps) => {
  const { id } = await params;
  const { role, source, categorySearch, categoryPage } = await searchParams;
  const viewerRole = (role as CourseViewerRole) || "student";

  // A student reaching this page from the public browse-courses listing
  // hasn't enrolled yet, so the authenticated details endpoint (which
  // requires an enrollment for students) would 404 — use the public
  // endpoint instead, which only needs the course to be verified.
  const isFromBrowse = source === "browse";

  const course = isFromBrowse
    ? { ...(await getPublicCourseDetailsQuery(id)).data.course, videoUrl: "" }
    : (await getCourseDetailsQuery(id)).data.course;

  // Categories are only needed for the instructor's edit-mode category
  // picker — skip the extra request for every other viewer.
  const categoriesResponse =
    viewerRole === "instructor"
      ? await getCategoriesQuery({
          search: categorySearch,
          page: categoryPage ? Number(categoryPage) : 1,
        })
      : null;

  // Only an enrolled student can leave a review — check whether they already
  // have one so the "Add review" action can be swapped for "Already Reviewed".
  // getReviewByCourseAndStudentQuery throws on its 404 ("no review yet"), so
  // that's the "not reviewed" case rather than an unexpected failure.
  const isEnrolledStudent = viewerRole === "student" && source === "enrolled";
  let hasReviewed = false;
  if (isEnrolledStudent) {
    try {
      await getReviewsByCourseIdQuery(id);
      hasReviewed = true;
    } catch {
      hasReviewed = false;
    }
  }

  // Fetch the refund eligibility server-side so the "Request Refund" action
  // can be shown/hidden/disabled without a client round-trip. A failure here
  // (e.g. no transaction record at all) just means no refund action applies.
  let refundEligibility: CourseRefundEligibility | null = null;
  if (isEnrolledStudent) {
    try {
      refundEligibility = (await getCourseRefundEligibilityQuery(id)).data
        .eligibility;
    } catch {
      refundEligibility = null;
    }
  }

  // Needed to report watch progress (see API 3 in the enrollment guide) —
  // that endpoint is addressed by enrollment id, not course id.
  let enrollmentId: string | null = null;
  let resumePositionInSeconds = 0;
  if (isEnrolledStudent) {
    try {
      const enrollmentsResponse = await getEnrollmentsQuery({
        course: id,
        limit: 1,
      });
      const enrollment = enrollmentsResponse.data.enrollments[0];
      enrollmentId = enrollment?._id ?? null;
      resumePositionInSeconds =
        enrollment && course.totalDurationInMinutes > 0
          ? (course.totalDurationInMinutes * 60 * enrollment.watchPercentage) /
            100
          : 0;
    } catch {
      enrollmentId = null;
    }
  }

  return (
    <CourseDetails
      viewerRole={viewerRole}
      course={course}
      categories={categoriesResponse?.data.categories ?? []}
      categoriesPagination={
        categoriesResponse?.data.pagination ?? {
          page: 1,
          limit: 10,
          totalDocuments: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      }
      categorySearch={categorySearch ?? ""}
      hasReviewed={hasReviewed}
      refundEligibility={refundEligibility}
      enrollmentId={enrollmentId}
      resumePositionInSeconds={resumePositionInSeconds}
    />
  );
};

export default UnifiedCourseDetailsPage;
