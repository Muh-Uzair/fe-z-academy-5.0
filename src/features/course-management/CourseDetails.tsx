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
import { ArrowLeft, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/time";
import useClientAction from "@/hooks/useClientAction";
import CourseForm, {
  type CourseFormMode,
  type CourseSubmitValues,
} from "./CourseForm";
import {
  uploadCourseThumbnailAction,
  uploadCourseVideoAction,
  updateCourseAction,
  updateCourseVerificationAction,
} from "@/services/course/actions";
import type {
  CourseListItem,
  UploadCourseThumbnailResponse,
  UploadCourseVideoResponse,
} from "@/response-types/courseResponseTypes";
import type { Category } from "@/response-types/categoryResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import { formatCourseLevel, getCourseVerificationState } from "./courseHelpers";

type CourseViewerRole = "student" | "instructor" | "admin";

interface CourseDetailsProps {
  viewerRole: CourseViewerRole;
  course: CourseListItem;
  categories: Category[];
  categoriesPagination: Pagination;
  categorySearch: string;
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
}: CourseDetailsProps) => {
  console.log("Course Details:==========================", course);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [formMode, setFormMode] = useState<CourseFormMode>("view");
  const [adminReviewReason, setAdminReviewReason] = useState(
    course.verificationRejectionReason ?? "",
  );

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const { run: runUpdateAction, isLoading: isUpdating } = useClientAction();
  const { run: runVerifyAction, isLoading: isVerifying } = useClientAction();
  const { run: runRejectAction, isLoading: isRejecting } = useClientAction();

  const isInstructorViewer = viewerRole === "instructor";
  const isAdminViewer = viewerRole === "admin";
  const showAdminReviewPanel =
    isAdminViewer && searchParams.get("review") === "true";
  const source = searchParams.get("source");
  const isFromBrowse = source === "browse";
  const courseVerificationState = getCourseVerificationState(course);

  const pageDescription = isInstructorViewer
    ? "Review your course submission, then switch to edit mode when you need to update the content or replace media files."
    : isAdminViewer && showAdminReviewPanel
      ? "Review the submitted course and either verify it or return feedback to the instructor."
      : isAdminViewer
        ? "View the submitted course details exactly as the instructor sees them."
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
      }

      return updateCourseAction(course._id, {
        title: values.title,
        description: values.description,
        price: values.price,
        level: values.level,
        category: values.category,
        ...(thumbnailKey ? { thumbnailKey } : {}),
        ...(videoKey ? { videoKey } : {}),
      });
    });

    if (response?.status === "success") {
      router.refresh();
      return true;
    }

    return false;
  };

  const handleSubmitReview = () => {
    console.log("Submit review", {
      rating: reviewRating,
      feedback: reviewFeedback,
    });
    setReviewDialogOpen(false);
    setReviewRating(0);
    setReviewFeedback("");
  };

  const handleVerifyCourse = async () => {
    const response = await runVerifyAction(() =>
      updateCourseVerificationAction(course._id, { isVerified: true }),
    );

    if (response?.status === "success") {
      setAdminReviewReason("");
      router.refresh();
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
      router.refresh();
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
                  <Dialog
                    open={reviewDialogOpen}
                    onOpenChange={setReviewDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <AppButton>Add review</AppButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader variant="create">
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts about this course to help others.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogBody>
                        <div className="grid gap-4 py-0">
                          <div className="flex flex-col gap-2">
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="focus:outline-none"
                                  onClick={() => setReviewRating(star)}
                                >
                                  <Star
                                    className={cn(
                                      "h-6 w-6 cursor-pointer transition-colors",
                                      reviewRating >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground hover:text-yellow-400",
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                              id="feedback"
                              placeholder="Tell us what you liked or what could be improved..."
                              value={reviewFeedback}
                              onChange={(e) =>
                                setReviewFeedback(e.target.value)
                              }
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </DialogBody>
                      <DialogFooter>
                        <AppButton
                          type="button"
                          onClick={handleSubmitReview}
                          disabled={!reviewRating || !reviewFeedback.trim()}
                        >
                          Submit review
                        </AppButton>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                  {course.isVerified === false && (
                    <Badge variant="destructive">Not verified</Badge>
                  )}
                  {course.isVerified && <Badge>Verified</Badge>}

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
                isLoading={isUpdating}
              />
            </CardContent>
          </Card>

          {showAdminReviewPanel ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin Review</CardTitle>
                <CardDescription>
                  {courseVerificationState === "pending"
                    ? "This course has not been reviewed yet. Verify it or return a rejection reason to the instructor."
                    : "Update the review result if the course still needs changes or is ready to be approved."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Verification Rejection Reason
                  </p>
                  <Textarea
                    value={adminReviewReason}
                    onChange={(event) =>
                      setAdminReviewReason(event.target.value)
                    }
                    placeholder="Explain what the instructor needs to fix before this course can be approved."
                    className="min-h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave this blank if you are going to verify the course.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <AppButton
                    type="button"
                    variant="outline"
                    disabled={isVerifying || isRejecting}
                    isLoading={isVerifying}
                    onClick={handleVerifyCourse}
                  >
                    Verify Course
                  </AppButton>
                  <AppButton
                    type="button"
                    disabled={
                      !adminReviewReason.trim() || isVerifying || isRejecting
                    }
                    isLoading={isRejecting}
                    onClick={handleRejectCourse}
                  >
                    Save Rejection Reason
                  </AppButton>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </PageFlexCol>
      </div>
    </div>
  );
};

export default CourseDetails;
export type { CourseDetailsProps, CourseViewerRole };
