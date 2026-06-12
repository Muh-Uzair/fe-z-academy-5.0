"use client";

import React, { useState } from "react";
import { coursesData } from "@/dummy-data/coursesData";
import { reviewsData } from "@/dummy-data/reviewsData";
import { usersData } from "@/dummy-data/usersData";
import { Star, Users, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";

interface ViewCourseReviewsProps {
  courseId: string;
}

const REVIEWS_PER_PAGE = 5;

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

const ViewCourseReviews = ({ courseId }: ViewCourseReviewsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const course = coursesData.find((c) => c._id === courseId);
  const instructor = usersData.find((u) => u._id === course?.instructor);
  const courseReviews = reviewsData.filter((r) => r.course === courseId);

  const totalPages = Math.ceil(courseReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = courseReviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE,
  );

  const averageRating = courseReviews.length
    ? courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length
    : 0;

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The requested course does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left Column ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-8 space-y-4">
          {/* Course Card */}
          <CourseCard
            course={{
              ...course,
              category: course.categoryName,
              instructor: course.instructorName,
            }}
          />

          {/* Instructor Card */}
          {instructor && (
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Instructor
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 border-2 border-border">
                    <AvatarImage
                      src={String(instructor.avatar)}
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
                      {instructor.highestEducation}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="text-foreground font-medium">
                        {instructor.highestEducation}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="text-foreground font-medium">
                        {instructor.yearsOfExperience} years
                      </span>
                    </div>
                  </div>
                </div>
                {instructor.bio && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-4 line-clamp-3">
                    {instructor.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right Column: Reviews ───────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="flex items-end justify-between pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Student Reviews
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {courseReviews.length}{" "}
                {courseReviews.length === 1 ? "review" : "reviews"} for this
                course
              </p>
            </div>
            {courseReviews.length > 0 && (
              <div className="flex items-center gap-2 pb-0.5">
                <StarRating rating={Math.round(averageRating)} />
                <span className="text-sm font-semibold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Empty State */}
          {courseReviews.length === 0 ? (
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
              {currentReviews.map((review) => {
                const reviewer = usersData.find(
                  (u) => u._id === review.reviewBy,
                );

                return (
                  <Card
                    key={review._id}
                    className="border-border/50 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <Avatar className="h-10 w-10 shrink-0 border">
                          <AvatarImage
                            src={String(reviewer?.avatar)}
                            alt={reviewer?.fullName || "Student"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {(reviewer?.fullName || "ST")
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h4 className="font-semibold text-foreground text-sm leading-none">
                                {reviewer?.fullName || "Anonymous Student"}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(review.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>

                          <p className="text-sm text-foreground/85 leading-relaxed pt-1">
                            {review.feedback}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="h-8 px-4 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="h-8 px-4 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCourseReviews;
