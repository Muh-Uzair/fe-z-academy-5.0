"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { ICategory } from "@/types/categoryTypes";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const adminCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
  imageFile: z
    .custom<File | null | undefined>(
      (value) =>
        value === undefined || value === null || value instanceof File,
      "Please select a valid image file.",
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, and .png formats are supported.",
    ),
  description: z.string().trim().min(1, "Description is required."),
});

type AdminCategoryFormValues = z.infer<typeof adminCategorySchema>;
type AdminCategoryFormMode = "create" | "view" | "edit";

interface AdminCategorySubmitValues {
  name: string;
  description: string;
  imageFile: File | null;
  imageUrl: string | null;
}

interface AdminCategoriesFormProps {
  mode: AdminCategoryFormMode;
  initialData?: ICategory | null;
  onSubmit: (values: AdminCategorySubmitValues) => void;
  onClose: () => void;
  onModeChange?: (mode: Exclude<AdminCategoryFormMode, "create">) => void;
}

const emptyValues: AdminCategoryFormValues = {
  name: "",
  imageFile: undefined,
  description: "",
};

const getDefaultValues = (
  initialData?: ICategory | null,
): AdminCategoryFormValues => ({
  name: initialData?.name ?? "",
  imageFile: undefined,
  description: initialData?.description ?? "",
});

const AdminCategoriesForm = ({
  mode,
  initialData,
  onSubmit,
  onClose,
  onModeChange,
}: AdminCategoriesFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<AdminCategoryFormValues>({
    resolver: zodResolver(adminCategorySchema),
    mode: "onChange",
    defaultValues: initialData ? getDefaultValues(initialData) : emptyValues,
  });

  const isReadOnly = mode === "view";
  const selectedImageFile = useWatch({
    control: form.control,
    name: "imageFile",
  });
  const hasSelectedImage = Boolean(selectedImageFile);

  const revokeUnsavedPreview = () => {
    if (selectedImageFile && previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    revokeUnsavedPreview();

    const nextPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(nextPreviewUrl);
    form.setValue("imageFile", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleRemoveSelectedImage = () => {
    revokeUnsavedPreview();
    setPreviewUrl(initialData?.image ?? null);
    form.setValue("imageFile", undefined, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (values: AdminCategoryFormValues) => {
    const imageUrl = previewUrl ?? initialData?.image ?? null;

    if (!imageUrl) {
      form.setError("imageFile", {
        type: "manual",
        message: "Category image is required.",
      });
      return;
    }

    onSubmit({
      name: values.name,
      description: values.description,
      imageFile: values.imageFile ?? null,
      imageUrl,
    });

    if (mode === "create") {
      form.reset(emptyValues);
      setPreviewUrl(null);
    }
  };

  const handleViewMode = () => {
    revokeUnsavedPreview();
    form.reset(getDefaultValues(initialData));
    setPreviewUrl(initialData?.image ?? null);
    onModeChange?.("view");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    revokeUnsavedPreview();
    form.reset(mode === "create" ? emptyValues : getDefaultValues(initialData));
    setPreviewUrl(initialData?.image ?? null);
    onClose();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Web Development"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormDescription>
                Use a clear category title that admins and students can scan
                quickly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageFile"
          render={() => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormDescription>
                Upload a `.jpg`, `.jpeg`, or `.png` image. We will later upload
                it to S3 with a presigned URL and store the public URL in the
                backend.
              </FormDescription>

              {previewUrl ? (
                <div className="space-y-3">
                  <AspectRatio
                    ratio={16 / 9}
                    className="overflow-hidden rounded-lg border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>

                  {!isReadOnly ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Keep the current image, or upload a new one to replace
                        it.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <label htmlFor="category-image-upload">
                          <Button
                            type="button"
                            variant="outline"
                            iconLeft={ImagePlus}
                          asChild
                        >
                            <span>Choose Another Image</span>
                          </Button>
                        </label>
                        {hasSelectedImage ? (
                          <Button
                            type="button"
                            variant="outline"
                            iconLeft={X}
                            onClick={handleRemoveSelectedImage}
                          >
                            Keep Current Image
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : isReadOnly ? (
                <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
                  No image available for this category.
                </div>
              ) : (
                <AspectRatio
                  ratio={16 / 9}
                  className="overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/40"
                >
                  <label
                    htmlFor="category-image-upload"
                    className="flex h-full w-full cursor-pointer items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                      <Upload className="text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Choose a category image
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
                    ref={fileInputRef}
                    id="category-image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </FormControl>
              ) : null}
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
                  placeholder="All courses related to modern web technologies."
                  className="min-h-28"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormDescription>
                Describe what this category covers in a short admin-friendly
                summary.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {mode === "view" ? (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" onClick={() => onModeChange?.("edit")}>
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={mode === "edit" ? handleViewMode : handleClose}
              >
                {mode === "edit" ? "Back to View" : "Cancel"}
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                {mode === "edit" ? "Save Changes" : "Create Category"}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AdminCategoriesForm;
export type {
  AdminCategoryFormMode,
  AdminCategoryFormValues,
  AdminCategorySubmitValues,
};
