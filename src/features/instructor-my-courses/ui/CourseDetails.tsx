"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import InstructorCourseForm, {
  type InstructorCourseFormMode,
  type InstructorCourseSubmitValues,
} from "./InstructorCourseForm";
import {
  instructorCourseCategoryOptions,
  instructorCoursesMockData,
  type InstructorCourseRecord,
  type InstructorCourseStatus,
} from "./instructorCourseMockData";

const statusBadgeVariantMap: Record<
  InstructorCourseStatus,
  "secondary" | "default" | "destructive"
> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const statusLabelMap: Record<InstructorCourseStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Needs Changes",
};

const CourseDetails = () => {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const routeCourseId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [coursesById, setCoursesById] = useState<
    Record<string, InstructorCourseRecord>
  >(() =>
    Object.fromEntries(
      instructorCoursesMockData.map((mockCourse) => [
        mockCourse._id,
        mockCourse,
      ]),
    ),
  );
  const [formMode, setFormMode] = useState<InstructorCourseFormMode>("view");

  const course =
    (routeCourseId ? coursesById[routeCourseId] : null) ??
    instructorCoursesMockData[0];

  const handleUpdateCourse = (values: InstructorCourseSubmitValues) => {
    if (!course) {
      return;
    }

    const selectedCategory = instructorCourseCategoryOptions.find(
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

    const updatedCourse: InstructorCourseRecord = {
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

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Course Details"
        pageDescription="Review your course submission, then switch to edit mode when you need to update the content or replace media files."
        pageHeaderLeftSection={
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
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
              <Badge variant={statusBadgeVariantMap[course.status]}>
                {statusLabelMap[course.status]}
              </Badge>
              <Badge variant="outline">
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
              <Badge variant="outline">${course.price}</Badge>
            </div>
            <p className="text-muted-foreground">{course.description}</p>
            {course.status === "rejected" &&
            course.verificationRejectionReason ? (
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
            {formMode === "edit" ? "Edit Course" : "View Course"}
          </CardTitle>
          <CardDescription>
            {formMode === "edit"
              ? "Update the course details and save your changes."
              : "Use the same shared form structure for reviewing and editing this course."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstructorCourseForm
            key={`${course._id}-${formMode}-${course.updatedAt}`}
            mode={formMode}
            initialData={course}
            categoryOptions={instructorCourseCategoryOptions}
            onSubmit={handleUpdateCourse}
            onClose={() => router.back()}
            onModeChange={setFormMode}
          />
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default CourseDetails;
