"use client";

import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseForm, {
  type CourseSubmitValues,
} from "@/features/course-management/CourseForm";
import useClientAction from "@/hooks/useClientAction";
import {
  uploadCourseThumbnailAction,
  uploadCourseVideoAction,
  createCourseAction,
} from "@/services/course/actions";
import type { Category } from "@/response-types/categoryResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import type {
  UploadCourseThumbnailResponse,
  UploadCourseVideoResponse,
} from "@/response-types/courseResponseTypes";

// Both upload-URL responses share this shape: an S3 POST policy plus the
// object key to send back when creating/updating the course.
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

type CreateNewCoursesProps = {
  categories: Category[];
  categoriesPagination: Pagination;
  categorySearch: string;
};

const CreateNewCourses = ({
  categories,
  categoriesPagination,
  categorySearch,
}: CreateNewCoursesProps) => {
  const router = useRouter();
  const { run: runCreateAction, isLoading: isCreating } = useClientAction();

  const updateCategoryQuery = (next: {
    search?: string;
    page?: number;
  }) => {
    const nextSearch = next.search ?? categorySearch;
    const nextPage = next.page ?? categoriesPagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("categorySearch", nextSearch);
    if (nextPage > 1) searchParams.set("categoryPage", String(nextPage));

    const query = searchParams.toString();
    router.push(
      `/instructor/my-courses/create-new-courses${query ? `?${query}` : ""}`,
      { scroll: false },
    );
  };

  const handleCreateCourse = async (values: CourseSubmitValues) => {
    if (!values.thumbnailFile || !values.videoFile) {
      return false;
    }

    const thumbnailFile = values.thumbnailFile;
    const videoFile = values.videoFile;

    const response = await runCreateAction(async () => {
      const thumbnailUploadResponse = await uploadCourseThumbnailAction({
        fileName: thumbnailFile.name,
        fileType: thumbnailFile.type as "image/jpeg" | "image/png",
      });

      if (thumbnailUploadResponse.status !== "success") {
        return thumbnailUploadResponse;
      }

      const isThumbnailUploaded = await uploadFileToS3(
        thumbnailUploadResponse.data,
        thumbnailFile,
      );

      if (!isThumbnailUploaded) {
        return {
          status: "error" as const,
          message: "Failed to upload the course thumbnail. Please try again.",
          data: null,
        };
      }

      const videoUploadResponse = await uploadCourseVideoAction({
        fileName: videoFile.name,
        fileType: videoFile.type as "video/mp4" | "video/webm",
      });

      if (videoUploadResponse.status !== "success") {
        return videoUploadResponse;
      }

      const isVideoUploaded = await uploadFileToS3(
        videoUploadResponse.data,
        videoFile,
      );

      if (!isVideoUploaded) {
        return {
          status: "error" as const,
          message: "Failed to upload the course video. Please try again.",
          data: null,
        };
      }

      return createCourseAction({
        title: values.title,
        description: values.description,
        price: values.price,
        level: values.level,
        category: values.category,
        thumbnailKey: thumbnailUploadResponse.data.key,
        videoKey: videoUploadResponse.data.key,
      });
    });

    if (response?.status === "success") {
      router.push("/instructor/my-courses/all-my-courses");
      return true;
    }

    return false;
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Create New Course"
        pageDescription="Fill in the course details, then upload a thumbnail and video to submit it for admin review."
      />

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Course Submission Form</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            mode="create"
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
            onSubmit={handleCreateCourse}
            onClose={() =>
              router.push("/instructor/my-courses/all-my-courses")
            }
            isLoading={isCreating}
          />
        </CardContent>
      </Card>
    </PageFlexCol>
  );
};

export default CreateNewCourses;

