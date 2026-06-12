import ViewCourseReviews from "@/features/view-course-reviews/ViewCourseReviews";
import React from "react";

const ViewCourseReviewsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  return <ViewCourseReviews courseId={resolvedParams.id} />;
};

export default ViewCourseReviewsPage;
