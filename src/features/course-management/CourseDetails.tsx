"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { Star } from "lucide-react";
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
import CourseForm, {
  type CourseFormMode,
  type CourseSubmitValues,
} from "./CourseForm";
import { categoriesData as courseCategoryOptions } from "@/dummy-data/categoriesData";
import { coursesData as courseMockData } from "@/dummy-data/coursesData";
import { type CourseRecord } from "@/types/courseTypes";
import { formatCourseLevel, getCourseVerificationState } from "./courseHelpers";

const CATEGORY_PAGE_SIZE = 10;

// This screen is still driven by dummy data end-to-end (see courseMockData
// above), so category search/pagination is faked client-side here instead of
// going through the real categories API — see CreateNewCourses.tsx for the
// real, server-backed implementation of the same PagedSearchSelect pattern.
const paginateCategories = (search: string, page: number) => {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = normalizedSearch
    ? courseCategoryOptions.filter((category) =>
        category.name.toLowerCase().includes(normalizedSearch),
      )
    : courseCategoryOptions;

  const totalDocuments = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalDocuments / CATEGORY_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * CATEGORY_PAGE_SIZE;

  return {
    items: filtered.slice(start, start + CATEGORY_PAGE_SIZE),
    pagination: {
      page: currentPage,
      limit: CATEGORY_PAGE_SIZE,
      totalDocuments,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};

type CourseViewerRole = "student" | "instructor" | "admin";

interface CourseDetailsProps {
  viewerRole: CourseViewerRole;
}

const CourseDetails = ({ viewerRole }: CourseDetailsProps) => {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeCourseId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [coursesById, setCoursesById] = useState<Record<string, CourseRecord>>(
    () =>
      Object.fromEntries(
        courseMockData.map((mockCourse) => [mockCourse._id, mockCourse]),
      ),
  );
  const [formMode, setFormMode] = useState<CourseFormMode>("view");
  const [adminReviewReasonById, setAdminReviewReasonById] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      courseMockData.map((mockCourse) => [
        mockCourse._id,
        mockCourse.verificationRejectionReason ?? "",
      ]),
    ),
  );

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const { items: categoryItems, pagination: categoryPagination } =
    paginateCategories(categorySearch, categoryPage);

  const course =
    (routeCourseId ? coursesById[routeCourseId] : null) ?? courseMockData[0];

  const isInstructorViewer = viewerRole === "instructor";
  const isAdminViewer = viewerRole === "admin";
  const showAdminReviewPanel =
    isAdminViewer && searchParams.get("review") === "true";
  const source = searchParams.get("source");
  const isFromBrowse = source === "browse";
  const adminReviewReason = adminReviewReasonById[course._id] ?? "";
  const courseVerificationState = getCourseVerificationState(course);

  const pageDescription = isInstructorViewer
    ? "Review your course submission, then switch to edit mode when you need to update the content or replace media files."
    : isAdminViewer && showAdminReviewPanel
      ? "Review the submitted course and either verify it or return feedback to the instructor."
      : isAdminViewer
        ? "View the submitted course details exactly as the instructor sees them."
        : "Review the course details.";

  const handleUpdateCourse = (values: CourseSubmitValues) => {
    if (!course) {
      return;
    }

    const selectedCategory = courseCategoryOptions.find(
      (categoryOption) => categoryOption._id === values.category,
    );

    console.log("update course form data", {
      courseId: course._id,
      title: values.title,
      description: values.description,
      price: values.price,
      level: values.level,
      category: values.category,
      thumbnailFile: values.thumbnailFile,
      thumbnailFileName: values.thumbnailFile?.name ?? null,
      thumbnailFileType: values.thumbnailFile?.type ?? null,
      thumbnailPreviewUrl: values.thumbnailUrl,
      videoFile: values.videoFile,
      videoFileName: values.videoFile?.name ?? null,
      videoFileType: values.videoFile?.type ?? null,
      videoPreviewUrl: values.videoUrl,
    });

    const updatedCourse: CourseRecord = {
      ...course,
      title: values.title,
      description: values.description,
      price: values.price,
      level: values.level,
      category: values.category,
      categoryName: selectedCategory?.name ?? course.categoryName,
      thumbnail: values.thumbnailUrl ?? course.thumbnail,
      videoUrl: values.videoUrl ?? course.videoUrl,
      updatedAt: new Date().toISOString(),
    };

    setCoursesById((currentCoursesById) => ({
      ...currentCoursesById,
      [course._id]: updatedCourse,
    }));
    setFormMode("view");
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

  const handleVerifyCourse = () => {
    console.log("verify course", {
      courseId: course._id,
    });

    const verifiedCourse: CourseRecord = {
      ...course,
      isVerified: true,
      verificationRejectionReason: null,
      updatedAt: new Date().toISOString(),
    };

    setCoursesById((currentCoursesById) => ({
      ...currentCoursesById,
      [course._id]: verifiedCourse,
    }));
    setAdminReviewReasonById((currentReasons) => ({
      ...currentReasons,
      [course._id]: "",
    }));
  };

  const handleRejectCourse = () => {
    const trimmedReason = adminReviewReason.trim();

    if (!trimmedReason) {
      return;
    }

    console.log("reject course", {
      courseId: course._id,
      verificationRejectionReason: trimmedReason,
    });

    const rejectedCourse: CourseRecord = {
      ...course,
      isVerified: false,
      verificationRejectionReason: trimmedReason,
      updatedAt: new Date().toISOString(),
    };

    setCoursesById((currentCoursesById) => ({
      ...currentCoursesById,
      [course._id]: rejectedCourse,
    }));
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
                <AppButton variant="outline" onClick={() => router.back()}>
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
                            onChange={(e) => setReviewFeedback(e.target.value)}
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
                <CardDescription>{course.categoryName}</CardDescription>
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
                  <p className="font-medium">{course.instructorName}</p>
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
                categoryItems={categoryItems.map((category) => ({
                  id: category._id,
                  label: category.name,
                }))}
                categoryPagination={categoryPagination}
                categorySearch={categorySearch}
                onCategorySearchChange={(value) => {
                  setCategorySearch(value);
                  setCategoryPage(1);
                }}
                onCategoryPageChange={setCategoryPage}
                onSubmit={handleUpdateCourse}
                onClose={() => router.back()}
                onModeChange={isInstructorViewer ? setFormMode : undefined}
                allowEdit={isInstructorViewer}
                hideVideo={isFromBrowse}
                showEnrollButton={isFromBrowse}
                onEnroll={() => router.push(`/course-checkout/${course._id}`)}
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
                      setAdminReviewReasonById((currentReasons) => ({
                        ...currentReasons,
                        [course._id]: event.target.value,
                      }))
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
                    onClick={handleVerifyCourse}
                  >
                    Verify Course
                  </AppButton>
                  <AppButton
                    type="button"
                    onClick={handleRejectCourse}
                    disabled={!adminReviewReason.trim()}
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
