"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, ImagePlus, Upload, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import AppButton from "@/components/AppButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseLevel } from "@/types/courseTypes";
import PagedSearchSelect, {
  type PagedSearchSelectItem,
} from "@/components/PagedSearchSelect";
import type { Pagination } from "@/response-types/userResponseTypes";
import type { CourseListItem } from "@/response-types/courseResponseTypes";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_THUMBNAIL_SIZE_IN_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_IN_BYTES = 20 * 1024 * 1024;

const isFileInstance = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Course title must be at least 5 characters.")
    .max(120, "Course title must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(5000, "Description must be at most 5000 characters."),
  price: z
    .number({
      error: "Course price is required.",
    })
    .min(1, "Course price must be greater than 0."),
  level: z.nativeEnum(CourseLevel, {
    error: "Course level is required.",
  }),
  categoryId: z.string().trim().min(1, "Course category is required."),
  thumbnailFile: z
    .custom<
      File | null | undefined
    >((value) => value === undefined || value === null || isFileInstance(value), "Please select a valid image file.")
    .refine(
      (file) =>
        !file ||
        !isFileInstance(file) ||
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, and .png image formats are supported.",
    )
    .refine(
      (file) =>
        !file ||
        !isFileInstance(file) ||
        file.size <= MAX_THUMBNAIL_SIZE_IN_BYTES,
      "Course thumbnail must be 5MB or smaller.",
    ),
  videoFile: z
    .custom<File | null | undefined>(
      (value) => value === undefined || value === null || isFileInstance(value),
      "Please select a valid video file.",
    )
    .refine(
      (file) =>
        !file ||
        !isFileInstance(file) ||
        ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Only .mp4 and .webm video formats are supported.",
    )
    .refine(
      (file) =>
        !file || !isFileInstance(file) || file.size <= MAX_VIDEO_SIZE_IN_BYTES,
      "Course video must be 20MB or smaller.",
    ),
});

type CourseFormValues = z.infer<typeof courseSchema>;
type CourseFormMode = "create" | "view" | "edit";

interface CourseSubmitValues {
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  category: string;
  thumbnailFile: File | null;
  thumbnailUrl: string | null;
  videoFile: File | null;
  videoUrl: string | null;
}

interface CourseFormProps {
  mode: CourseFormMode;
  categoryItems: PagedSearchSelectItem[];
  categoryPagination: Pagination;
  categorySearch: string;
  onCategorySearchChange: (value: string) => void;
  onCategoryPageChange: (page: number) => void;
  initialData?: CourseListItem | null;
  // Return `false` (or resolve to it) to signal failure — the form then
  // keeps the entered values instead of resetting, so the caller can retry.
  onSubmit: (
    values: CourseSubmitValues,
  ) => void | boolean | Promise<void | boolean>;
  onClose: () => void;
  onModeChange?: (mode: Exclude<CourseFormMode, "create">) => void;
  allowEdit?: boolean;
  hideVideo?: boolean;
  showEnrollButton?: boolean;
  onEnroll?: () => void;
  isLoading?: boolean;
}

const emptyValues: CourseFormValues = {
  title: "",
  description: "",
  price: 1,
  level: CourseLevel.Beginner,
  categoryId: "",
  thumbnailFile: undefined,
  videoFile: undefined,
};

const getDefaultValues = (
  initialData?: CourseListItem | null,
): CourseFormValues => ({
  title: initialData?.title ?? "",
  description: initialData?.description ?? "",
  price: initialData?.price ?? 1,
  level: (initialData?.level as CourseLevel) ?? CourseLevel.Beginner,
  categoryId: initialData?.categoryDetails._id ?? "",
  thumbnailFile: undefined,
  videoFile: undefined,
});

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.round(sizeInBytes / 1024)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const revokeObjectUrl = (url: string | null) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const CourseForm = ({
  mode,
  categoryItems,
  categoryPagination,
  categorySearch,
  onCategorySearchChange,
  onCategoryPageChange,
  initialData,
  onSubmit,
  onClose,
  onModeChange,
  allowEdit = true,
  hideVideo = false,
  showEnrollButton = false,
  onEnroll,
  isLoading = false,
}: CourseFormProps) => {
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    initialData?.thumbnailUrl ?? null,
  );
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(
    initialData?.videoUrl ?? null,
  );
  const [thumbnailInputKey, setThumbnailInputKey] = useState(0);
  const [videoInputKey, setVideoInputKey] = useState(0);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: initialData ? getDefaultValues(initialData) : emptyValues,
  });

  const isReadOnly = mode === "view";
  const selectedVideoFile = useWatch({
    control: form.control,
    name: "videoFile",
  });

  useEffect(() => {
    return () => {
      revokeObjectUrl(thumbnailPreviewUrl);
      revokeObjectUrl(videoPreviewUrl);
    };
  }, [thumbnailPreviewUrl, videoPreviewUrl]);

  const clearFileInputs = () => {
    setThumbnailInputKey((currentValue) => currentValue + 1);
    setVideoInputKey((currentValue) => currentValue + 1);
  };

  const resetToInitialState = () => {
    revokeObjectUrl(thumbnailPreviewUrl);
    revokeObjectUrl(videoPreviewUrl);
    setThumbnailPreviewUrl(initialData?.thumbnailUrl ?? null);
    setVideoPreviewUrl(initialData?.videoUrl ?? null);
    form.reset(mode === "create" ? emptyValues : getDefaultValues(initialData));
    clearFileInputs();
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    revokeObjectUrl(thumbnailPreviewUrl);

    const nextPreviewUrl = URL.createObjectURL(file);

    setThumbnailPreviewUrl(nextPreviewUrl);
    form.setValue("thumbnailFile", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    revokeObjectUrl(videoPreviewUrl);

    const nextPreviewUrl = URL.createObjectURL(file);

    setVideoPreviewUrl(nextPreviewUrl);
    form.setValue("videoFile", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSubmit = async (values: CourseFormValues) => {
    const thumbnailUrl = thumbnailPreviewUrl ?? initialData?.thumbnailUrl ?? null;
    const videoUrl = videoPreviewUrl ?? initialData?.videoUrl ?? null;

    if (!thumbnailUrl) {
      form.setError("thumbnailFile", {
        type: "manual",
        message: "Course thumbnail is required.",
      });
      return;
    }

    if (!videoUrl) {
      form.setError("videoFile", {
        type: "manual",
        message: "Course video is required.",
      });
      return;
    }

    const result = await onSubmit({
      title: values.title,
      description: values.description,
      price: values.price,
      level: values.level,
      category: values.categoryId,
      thumbnailFile: values.thumbnailFile ?? null,
      thumbnailUrl,
      videoFile: values.videoFile ?? null,
      videoUrl,
    });

    if (mode === "create") {
      // Only clear the form once the caller confirms the submit succeeded —
      // on failure (e.g. a failed S3 upload or a rejected create call), keep
      // the entered values so the admin/instructor can retry.
      if (result === false) {
        return;
      }

      form.reset(emptyValues);
      revokeObjectUrl(thumbnailPreviewUrl);
      revokeObjectUrl(videoPreviewUrl);
      setThumbnailPreviewUrl(null);
      setVideoPreviewUrl(null);
      clearFileInputs();
      return;
    }

    // Same as create mode — only leave edit mode if the update actually
    // succeeded, so a failed save doesn't silently discard the admin's/
    // instructor's edits.
    if (result === false) {
      return;
    }

    onModeChange?.("view");
  };

  const handleViewMode = () => {
    resetToInitialState();
    onModeChange?.("view");
  };

  const handleClose = () => {
    resetToInitialState();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Modern React Foundations"
                      disabled={isReadOnly}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the skills, outcomes, and practical value students will get from this course."
                      className="min-h-36"
                      disabled={isReadOnly}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="0.01"
                        value={field.value}
                        disabled={isReadOnly}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select course level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CourseLevel.Beginner}>
                            Beginner
                          </SelectItem>
                          <SelectItem value={CourseLevel.Intermediate}>
                            Intermediate
                          </SelectItem>
                          <SelectItem value={CourseLevel.Advanced}>
                            Advanced
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <PagedSearchSelect
                        items={categoryItems}
                        pagination={categoryPagination}
                        search={categorySearch}
                        value={field.value}
                        onValueChange={field.onChange}
                        onSearchChange={onCategorySearchChange}
                        onPageChange={onCategoryPageChange}
                        selectedLabel={initialData?.categoryDetails.name}
                        placeholder="Select category"
                        searchPlaceholder="Search categories..."
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="thumbnailFile"
              render={() => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  {!isReadOnly && (
                    <FormDescription>
                      A sharp 16:9 image works best. Accepts .jpg, .jpeg, or .png, up to 5MB.
                    </FormDescription>
                  )}

                  {thumbnailPreviewUrl ? (
                    <div className="space-y-3">
                      <AspectRatio
                        ratio={16 / 9}
                        className="overflow-hidden rounded-lg border bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnailPreviewUrl}
                          alt="Course thumbnail preview"
                          className="h-full w-full object-cover"
                        />
                      </AspectRatio>

                      {!isReadOnly ? (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Upload a new thumbnail to replace the current
                            preview.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <AppButton
                              type="button"
                              variant="outline"
                              iconLeft={ImagePlus}
                              onClick={() =>
                                thumbnailFileInputRef.current?.click()
                              }
                            >
                              Choose Another Thumbnail
                            </AppButton>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : isReadOnly ? (
                    <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
                      No thumbnail available for this course yet.
                    </div>
                  ) : (
                    <AspectRatio
                      ratio={16 / 9}
                      className="overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/40"
                    >
                      <label
                        htmlFor="course-thumbnail-upload"
                        className="flex h-full w-full cursor-pointer items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-3 px-4 text-center">
                          <Upload className="text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Choose a course thumbnail
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Recommended display ratio is 16:9
                            </p>
                          </div>
                        </div>
                      </label>
                    </AspectRatio>
                  )}

                  {!isReadOnly ? (
                    <FormControl>
                      <Input
                        key={thumbnailInputKey}
                        ref={thumbnailFileInputRef}
                        id="course-thumbnail-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </FormControl>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            {!hideVideo && (
              <FormField
                control={form.control}
                name="videoFile"
                render={() => (
                  <FormItem>
                    <FormLabel>Course Video</FormLabel>
                    {!isReadOnly && (
                      <FormDescription>
                        Clear audio and video help it pass review faster. Accepts .mp4 or .webm, up to 20MB.
                      </FormDescription>
                    )}

                    {videoPreviewUrl ? (
                      <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                        <video
                          src={videoPreviewUrl}
                          controls
                          controlsList="nodownload"
                          disablePictureInPicture
                          onContextMenu={(event) => event.preventDefault()}
                          preload="metadata"
                          className="aspect-video w-full rounded-lg border bg-black"
                        />
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {selectedVideoFile ? (
                            <>
                              <p className="font-medium text-foreground">
                                {selectedVideoFile.name}
                              </p>
                              <p>{formatFileSize(selectedVideoFile.size)}</p>
                            </>
                          ) : (
                            <p>Current course video preview.</p>
                          )}
                        </div>

                        {!isReadOnly ? (
                          <div className="flex flex-wrap gap-2">
                            <AppButton
                              type="button"
                              variant="outline"
                              iconLeft={Video}
                              onClick={() => videoFileInputRef.current?.click()}
                            >
                              Choose Another Video
                            </AppButton>
                          </div>
                        ) : null}
                      </div>
                    ) : isReadOnly ? (
                      <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
                        No course video available yet.
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-border bg-muted/40 p-6">
                        <label
                          htmlFor="course-video-upload"
                          className="flex cursor-pointer flex-col items-center gap-3 text-center"
                        >
                          <Video className="text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Choose a course video
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Maximum file size is 20MB
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    {!isReadOnly ? (
                      <FormControl>
                        <Input
                          key={videoInputKey}
                          ref={videoFileInputRef}
                          id="course-video-upload"
                          type="file"
                          accept=".mp4,.webm,video/mp4,video/webm"
                          className="hidden"
                          onChange={handleVideoChange}
                        />
                      </FormControl>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          {mode === "view" ? (
            <>
              {!allowEdit ? (
                <AppButton
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Close
                </AppButton>
              ) : null}
              {allowEdit ? (
                <AppButton type="button" onClick={() => onModeChange?.("edit")}>
                  Edit Course
                </AppButton>
              ) : null}
              {showEnrollButton && onEnroll ? (
                <AppButton type="button" onClick={onEnroll}>
                  Enroll Now
                </AppButton>
              ) : null}
            </>
          ) : (
            <>
              {mode === "edit" ? (
                <AppButton
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleViewMode}
                >
                  Back to View
                </AppButton>
              ) : null}
              <AppButton
                type="submit"
                iconLeft={mode === "create" ? CirclePlus : undefined}
                loading={isLoading || form.formState.isSubmitting}
                disabled={isLoading}
              >
                {mode === "edit" ? "Save Changes" : "Create Course"}
              </AppButton>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
export type {
  CourseFormMode,
  CourseFormProps,
  CourseFormValues,
  CourseSubmitValues,
};
