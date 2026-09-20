"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, CheckCircle2, CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/time";
import useClientAction from "@/hooks/useClientAction";
import CourseForm, {
  type CourseFormMode,
  type CourseSubmitValues,
} from "./CourseForm";
import AddReviewDialog from "./AddReviewDialog";
import {
  uploadCourseThumbnailAction,
  uploadCourseVideoAction,
  updateCourseAction,
  updateCourseVerificationAction,
  requestCourseRefundAction,
} from "@/services/course/actions";
import { updateEnrollmentProgressAction } from "@/services/enrollment/actions";
import type {
  CourseListItem,
  CourseRefundEligibility,
  UploadCourseThumbnailResponse,
  UploadCourseVideoResponse,
} from "@/response-types/courseResponseTypes";
import type { Category } from "@/response-types/categoryResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import {
  formatCourseLevel,
  getCourseVerificationBadgeVariant,
  getCourseVerificationLabel,
  getCourseVerificationState,
  getVideoDurationInMinutes,
} from "./courseHelpers";

type CourseViewerRole = "student" | "instructor" | "admin";

interface CourseDetailsProps {
  viewerRole: CourseViewerRole;
  course: CourseListItem;
  categories: Category[];
  categoriesPagination: Pagination;
  categorySearch: string;
  hasReviewed?: boolean;
  refundEligibility?: CourseRefundEligibility | null;
  enrollmentId?: string | null;
}

// Both upload-URL responses share this shape: an S3 POST policy plus the
// object key to send back when updating the course.
async function uploadFileToS3(
  uploadData: Extract<
    UploadCourseThumbnailResponse | UploadCourseVideoResponse,
    { status: "success" }
  >["data"],
  file: File,
) {
  const formData = new FormData();

  Object.entries(uploadData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const res = await fetch(uploadData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  return res.ok;
}

const CourseDetails = ({
  viewerRole,
  course,
  categories,
  categoriesPagination,
  categorySearch,
  hasReviewed = false,
  refundEligibility = null,
  enrollmentId = null,
}: CourseDetailsProps) => {
  console.log("Course Details:==========================", course);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [formMode, setFormMode] = useState<CourseFormMode>("view");
  const [adminReviewReason, setAdminReviewReason] = useState(
    course.verificationRejectionReason ?? "",
  );
  const [isRefundConfirmOpen, setIsRefundConfirmOpen] = useState(false);

  const { run: runUpdateAction, isLoading: isUpdating } = useClientAction();
  const { run: runVerifyAction, isLoading: isVerifying } = useClientAction();
  const { run: runRejectAction, isLoading: isRejecting } = useClientAction();
  const { run: runRefundAction, isLoading: isRefunding } = useClientAction();

  const isInstructorViewer = viewerRole === "instructor";
  // Admin always reaches this page from an admin course list, which always
  // links here with review=true — there's no other admin entry point.
  const isAdminViewer = viewerRole === "admin";
  const source = searchParams.get("source");
  const isFromBrowse = source === "browse";
  const isDefaultStudentView = viewerRole === "student" && !source;
  const courseVerificationState = getCourseVerificationState(course);

  const pageDescription = isInstructorViewer
    ? "Review your course submission, then switch to edit mode when you need to update the content or replace media files."
    : isAdminViewer
      ? "Review the submitted course and either verify it or return feedback to the instructor."
      : "Review the course details.";

  const updateCategoryQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? categorySearch;
    const nextPage = next.page ?? categoriesPagination.page ?? 1;

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (nextSearch) {
      nextSearchParams.set("categorySearch", nextSearch);
    } else {
      nextSearchParams.delete("categorySearch");
    }
    if (nextPage > 1) {
      nextSearchParams.set("categoryPage", String(nextPage));
    } else {
      nextSearchParams.delete("categoryPage");
    }

    const query = nextSearchParams.toString();
    router.push(`/course-details/${course._id}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleUpdateCourse = async (values: CourseSubmitValues) => {
    const response = await runUpdateAction(async () => {
      let thumbnailKey: string | undefined;
      let videoKey: string | undefined;
      let totalDurationInMinutes: number | undefined;

      if (values.thumbnailFile) {
        const thumbnailUploadResponse = await uploadCourseThumbnailAction({
          fileName: values.thumbnailFile.name,
          fileType: values.thumbnailFile.type as "image/jpeg" | "image/png",
        });

        if (thumbnailUploadResponse.status !== "success") {
          return thumbnailUploadResponse;
        }

        const isThumbnailUploaded = await uploadFileToS3(
          thumbnailUploadResponse.data,
          values.thumbnailFile,
        );

        if (!isThumbnailUploaded) {
          return {
            status: "error" as const,
            message: "Failed to upload the course thumbnail. Please try again.",
            data: null,
          };
        }

        thumbnailKey = thumbnailUploadResponse.data.key;
      }

      if (values.videoFile) {
        const videoUploadResponse = await uploadCourseVideoAction({
          fileName: values.videoFile.name,
          fileType: values.videoFile.type as "video/mp4" | "video/webm",
        });

        if (videoUploadResponse.status !== "success") {
          return videoUploadResponse;
        }

        const isVideoUploaded = await uploadFileToS3(
          videoUploadResponse.data,
          values.videoFile,
        );

        if (!isVideoUploaded) {
          return {
            status: "error" as const,
            message: "Failed to upload the course video. Please try again.",
            data: null,
          };
        }

        videoKey = videoUploadResponse.data.key;
        totalDurationInMinutes = await getVideoDurationInMinutes(
          values.videoFile,
        );
      }

      return updateCourseAction(course._id, {
        title: values.title,
        description: values.description,
        price: values.price,
        level: values.level,
        category: values.category,
        ...(thumbnailKey ? { thumbnailKey } : {}),
        ...(videoKey ? { videoKey, totalDurationInMinutes } : {}),
      });
    });

    if (response?.status === "success") {
      return true;
    }

    return false;
  };

  const handleConfirmRequestRefund = async () => {
    const response = await runRefundAction(() =>
      requestCourseRefundAction(course._id),
    );

    if (response?.status === "success") {
      setIsRefundConfirmOpen(false);
      router.push("/student/my-learning/enrolled-courses");
    }
  };

  const handleVerifyCourse = async () => {
    const response = await runVerifyAction(() =>
      updateCourseVerificationAction(course._id, { isVerified: true }),
    );

    if (response?.status === "success") {
      setAdminReviewReason("");
      router.push("/admin/courses/verified-courses");
    }
  };

  const handleRejectCourse = async () => {
    const trimmedReason = adminReviewReason.trim();

    if (!trimmedReason) {
      return;
    }

    const response = await runRejectAction(() =>
      updateCourseVerificationAction(course._id, {
        isVerified: false,
        verificationRejectionReason: trimmedReason,
      }),
    );

    if (response?.status === "success") {
      router.push("/admin/courses/all-courses");
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-8">
      <div className="max-w-[1200px]">
        <PageFlexCol>
          <PageHeader
            pageHeading="Course Details"
            pageDescription={pageDescription}
            pageHeaderRightSection={
              <div className="flex items-center gap-2">
                <AppButton
                  variant="ghost"
                  iconLeft={ArrowLeft}
                  onClick={() => router.back()}
                >
                  Back
                </AppButton>
                {viewerRole === "student" && source === "enrolled" && (
                  <>
                    {hasReviewed ? (
                      <AppButton
                        variant="outline"
                        iconLeft={CheckCircle}
                        disabled
                      >
                        Already Reviewed
                      </AppButton>
                    ) : (
                      <AddReviewDialog courseId={course._id} />
                    )}
                  </>
                )}
              </div>
            }
          />

          <div className="grid gap-4 lg:grid-cols-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.categoryDetails.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getCourseVerificationBadgeVariant(course)}>
                    {getCourseVerificationLabel(course)}
                  </Badge>

                  <Badge variant="outline">
                    {formatCourseLevel(course.level)}
                  </Badge>
                  <Badge variant="outline">${course.price}</Badge>
                </div>
                <p className="text-muted-foreground">{course.description}</p>
                {course.verificationRejectionReason ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    {course.verificationRejectionReason}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Students Enrolled</p>
                  <p className="text-xl font-semibold">
                    {course.totalStudentsEnrolled}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Rating</p>
                  <p className="text-xl font-semibold">
                    {course.averageRating.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Reviews</p>
                  <p className="text-xl font-semibold">{course.totalReviews}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Instructor</p>
                  <p className="font-medium">
                    {course.instructorDetails.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-medium">{formatDate(course.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(course.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {course.totalDurationInMinutes} minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle>
                {isInstructorViewer && formMode === "edit"
                  ? "Edit Course"
                  : "View Course"}
              </CardTitle>
              <CardDescription>
                {isInstructorViewer && formMode === "edit"
                  ? "Update the course details and save your changes."
                  : "Use the shared course form to keep the viewing experience consistent across roles."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseForm
                key={`${course._id}-${viewerRole}-${formMode}-${course.updatedAt}`}
                mode={isInstructorViewer ? formMode : "view"}
                initialData={course}
                categoryItems={categories.map((category) => ({
                  id: category._id,
                  label: category.name,
                }))}
                categoryPagination={categoriesPagination}
                categorySearch={categorySearch}
                onCategorySearchChange={(value) =>
                  updateCategoryQuery({ search: value, page: 1 })
                }
                onCategoryPageChange={(page) => updateCategoryQuery({ page })}
                onSubmit={handleUpdateCourse}
                onClose={() => router.back()}
                onModeChange={isInstructorViewer ? setFormMode : undefined}
                allowEdit={isInstructorViewer}
                hideVideo={isFromBrowse}
                showEnrollButton={isFromBrowse}
                onEnroll={() => router.push(`/course-checkout/${course._id}`)}
                showRefundButton={
                  viewerRole === "student" &&
                  source === "enrolled" &&
                  !!refundEligibility
                }
                refundEligible={refundEligibility?.eligible ?? false}
                refundDisabledReason={refundEligibility?.reason ?? null}
                onRequestRefund={() => setIsRefundConfirmOpen(true)}
                isRefunding={isRefunding}
                isLoading={isUpdating}
                hideCloseButton={
                  isAdminViewer ||
                  isFromBrowse ||
                  source === "enrolled" ||
                  isDefaultStudentView
                }
                onVideoPause={
                  viewerRole === "student" &&
                  source === "enrolled" &&
                  enrollmentId
                    ? (currentTime) =>
                        updateEnrollmentProgressAction(enrollmentId, {
                          lastPositionInSeconds: Math.floor(currentTime),
                        })
                    : undefined
                }
              />
            </CardContent>
          </Card>

          {isAdminViewer ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin Review</CardTitle>
                <CardDescription>
                  {courseVerificationState === "pending"
                    ? "This course has not been reviewed yet. Verify it or return a rejection reason to the instructor."
                    : "Update the review result if the course still needs changes or is ready to be approved."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {courseVerificationState !== "verified" ? (
                  <div
                    className={cn(
                      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                      courseVerificationState !== "rejected" &&
                        "border-b pb-6",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">Verify this course</p>
                      <p className="text-sm text-muted-foreground">
                        Approve the course as-is — it becomes visible to
                        students once verified.
                      </p>
                    </div>
                    <AppButton
                      type="button"
                      iconLeft={CheckCircle2}
                      disabled={isVerifying || isRejecting}
                      isLoading={isVerifying}
                      onClick={handleVerifyCourse}
                    >
                      Verify Course
                    </AppButton>
                  </div>
                ) : null}

                {courseVerificationState !== "rejected" ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reject with feedback</p>
                    <Textarea
                      value={adminReviewReason}
                      onChange={(event) =>
                        setAdminReviewReason(event.target.value)
                      }
                      placeholder="Explain what the instructor needs to fix before this course can be approved."
                      className="min-h-32"
                    />
                    <p className="text-sm text-muted-foreground">
                      A rejection reason is required so the instructor knows
                      what to fix.
                    </p>

                    <div className="flex justify-end">
                      <AppButton
                        type="button"
                        variant="destructive"
                        iconLeft={XCircle}
                        disabled={
                          !adminReviewReason.trim() ||
                          isVerifying ||
                          isRejecting
                        }
                        isLoading={isRejecting}
                        onClick={handleRejectCourse}
                      >
                        Save Rejection Reason
                      </AppButton>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </PageFlexCol>
      </div>

      <AlertDialog
        open={isRefundConfirmOpen}
        onOpenChange={setIsRefundConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Refund</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to request a refund for &quot;
              {course.title}&quot;? This will cancel your enrollment and
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRefunding}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isRefunding}
              onClick={(event) => {
                event.preventDefault();
                handleConfirmRequestRefund();
              }}
            >
              {isRefunding ? "Requesting..." : "Request Refund"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetails;
export type { CourseDetailsProps, CourseViewerRole };
