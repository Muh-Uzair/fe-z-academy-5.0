"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppButton from "@/components/AppButton";
import AppLoadingScreen from "@/components/AppLoadingScreen";
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
import { getVideoDurationInMinutes } from "@/features/course-management/courseHelpers";
import { getInstructorOnboardingLinkAction } from "@/services/user/actions";
import type { AuthUser } from "@/response-types/authResponseTypes";

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
  const { run: runOnboardingAction, isLoading: isOnboarding } =
    useClientAction();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const loadStoredUser = () => {
      const storedUser = window.localStorage.getItem("currentUser");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as AuthUser);
        } catch {
          window.localStorage.removeItem("currentUser");
        }
      }

      setIsUserLoaded(true);
    };

    const timeoutId = window.setTimeout(loadStoredUser, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleStripeOnboarding = async () => {
    const response = await runOnboardingAction(() =>
      getInstructorOnboardingLinkAction(),
    );

    if (response?.status === "success") {
      window.location.assign(response.data.url);
    }
  };

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

      const totalDurationInMinutes = await getVideoDurationInMinutes(
        videoFile,
      );

      return createCourseAction({
        title: values.title,
        description: values.description,
        price: values.price,
        level: values.level,
        category: values.category,
        thumbnailKey: thumbnailUploadResponse.data.key,
        videoKey: videoUploadResponse.data.key,
        totalDurationInMinutes,
      });
    });

    if (response?.status === "success") {
      router.push("/instructor/my-courses/all-my-courses");
      return true;
    }

    return false;
  };

  if (!isUserLoaded) {
    return <AppLoadingScreen />;
  }

  if (user?.role === "instructor" && !user.stripeOnboardingComplete) {
    return (
      <PageFlexCol>
        <PageHeader
          pageHeading="Complete Stripe Onboarding"
          pageDescription="Connect your Stripe account before creating and publishing courses."
        />
        <Card>
          <CardHeader>
            <CardTitle>Stripe onboarding required</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Complete Stripe onboarding to receive payouts from your courses.
              Once your account is ready, return here to create a course.
            </p>
            <AppButton
              type="button"
              isLoading={isOnboarding}
              onClick={handleStripeOnboarding}
            >
              Complete Stripe onboarding
            </AppButton>
          </CardContent>
        </Card>
      </PageFlexCol>
    );
  }

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
