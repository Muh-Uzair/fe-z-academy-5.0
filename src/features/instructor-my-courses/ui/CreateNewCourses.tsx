"use client";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InstructorCourseForm, {
  type InstructorCourseSubmitValues,
} from "./InstructorCourseForm";
import { instructorCourseCategoryOptions } from "./instructorCourseMockData";

const CreateNewCourses = () => {
  const handleCreateCourse = (values: InstructorCourseSubmitValues) => {
    console.log("create course form data", {
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
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Create New Course"
        pageDescription="Build the static instructor course creation experience first. Later we can plug the same form into S3 upload and backend API calls."
      />

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Course Submission Form</CardTitle>
        </CardHeader>
        <CardContent>
          <InstructorCourseForm
            mode="create"
            categoryOptions={instructorCourseCategoryOptions}
            onSubmit={handleCreateCourse}
            onClose={() => console.log("course creation cancelled")}
          />
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default CreateNewCourses;
