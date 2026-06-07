"use client";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseForm, {
  type CourseSubmitValues,
} from "@/features/course-management/ui/CourseForm";
import { categoriesData } from "@/dummy-data";

const CreateNewCourses = () => {
  const handleCreateCourse = (values: CourseSubmitValues) => {
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
          <CourseForm
            mode="create"
            categoryOptions={categoriesData}
            onSubmit={handleCreateCourse}
            onClose={() => console.log("course creation cancelled")}
          />
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default CreateNewCourses;
