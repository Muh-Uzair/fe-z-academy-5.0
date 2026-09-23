"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Users, Trash2, Loader2, Pencil } from "lucide-react";
import AppButton from "@/components/AppButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CourseCard from "@/components/CourseCard";
import EditReviewDialog from "./EditReviewDialog";
import AddReviewDialog from "@/features/course-management/AddReviewDialog";
import type { CourseListItem } from "@/response-types/courseResponseTypes";
import type { Review } from "@/response-types/reviewResponseTypes";
import { deleteReviewAction } from "@/services/review/actions";
import type { Pagination } from "@/response-types/userResponseTypes";

type ViewCourseReviewsProps = {
  course: CourseListItem;
  reviews: Review[];
  pagination: Pagination | null;
  role: string;
  studentReview: Review | null;
  isEnrolled?: boolean;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground/25"
        }`}
      />
    ))}
  </div>
);

type ReviewCardProps = {
  review: Review;
  canDelete?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
};

const ReviewCard = ({ review, canDelete, isDeleting, onDelete, canEdit, onEdit }: ReviewCardProps) => (
  <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
    <CardContent className="p-5">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 shrink-0 border">
          <AvatarImage
            src={review.reviewByDetails.avatar ?? ""}
            alt={review.reviewByDetails.fullName}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {review.reviewByDetails.fullName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h4 className="font-semibold text-foreground text-sm leading-none">
                {review.reviewByDetails.fullName}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} />
              
              <div className="flex items-center gap-1 ml-2">
                {canEdit && (
                  <button
                    onClick={onEdit}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Edit Review"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive/80 disabled:opacity-50 transition-colors p-1 cursor-pointer"
                        title="Delete Review"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your review? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={onDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed pt-1">
            {review.feedback}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ViewCourseReviews = ({
  course,
  reviews,
  pagination,
  role,
  studentReview,
  isEnrolled,
}: ViewCourseReviewsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteReview = async () => {
    if (!studentReview) return;
    startTransition(async () => {
      await deleteReviewAction(studentReview._id);
    });
  };

  const updateQuery = (page: number) => {
    const searchParams = new URLSearchParams();
    if (page > 1) searchParams.set("page", String(page));
    const query = searchParams.toString();
    router.push(`/view-course-reviews/${course._id}${query ? `?${query}` : ""}`);
  };

  const instructor = course.instructorDetails;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left Column ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-8 space-y-4">
          <CourseCard
            course={course}
            footer={
              <AppButton
                className="w-full"
                onClick={() => router.push(`/course-details/${course._id}`)}
              >
                View Details
              </AppButton>
            }
          />

          {role !== "instructor" && (
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Instructor
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border-2 border-border">
                    <AvatarImage
                      src={instructor.avatar ?? ""}
                      alt={instructor.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {instructor.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {instructor.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {instructor.email}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <AppButton
                  className="w-full"
                  onClick={() =>
                    router.push(`/user-profile/${instructor._id}?role=instructor`)
                  }
                >
                  View Profile
                </AppButton>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* ── Right Column: Reviews ───────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {role === "student" ? (
            <>
              <div className="pb-4 border-b">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  My Review
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your review for this course.
                </p>
              </div>

              {studentReview ? (
                <>
                  <ReviewCard
                    review={studentReview}
                    canDelete={true}
                    isDeleting={isPending}
                    onDelete={handleDeleteReview}
                    canEdit={true}
                    onEdit={() => setIsEditOpen(true)}
                  />
                  <EditReviewDialog
                    review={studentReview}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                  />
                </>
              ) : (
                <Card className="border-dashed shadow-none bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center py-14 gap-2">
                    <Star className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm mb-3">
                      You have not reviewed this course yet.
                    </p>
                    {isEnrolled && <AddReviewDialog courseId={course._id} />}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <>
              <div className="flex items-end justify-between pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Student Reviews
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pagination?.totalDocuments}{" "}
                    {pagination?.totalDocuments === 1 ? "review" : "reviews"} for
                    this course
                  </p>
                </div>
                {course.averageRating > 0 && (
                  <div className="flex items-center gap-2 pb-0.5">
                    <StarRating rating={Math.round(course.averageRating)} />
                    <span className="text-sm font-semibold text-foreground">
                      {course.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <Card className="border-dashed shadow-none bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center py-14 gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">
                      No reviews yet for this course.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuery(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="h-8 px-4 text-xs"
                    >
                      Previous
                    </AppButton>
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuery(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="h-8 px-4 text-xs"
                    >
                      Next
                    </AppButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourseReviews;
