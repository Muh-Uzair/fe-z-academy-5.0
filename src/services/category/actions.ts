"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { CATEGORY_TAGS } from "./tags";
import type {
  UploadCategoryImageResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
} from "@/response-types/categoryResponseTypes";

/**
 * Admin only. Generates a presigned S3 POST policy for uploading a category
 * image directly from the browser. Upload the file to `data.uploadUrl` using
 * `data.fields`, then send `data.key` as `imageKey` to createCategoryAction
 * or updateCategoryAction.
 */
export async function uploadCategoryImageAction(data: {
  fileName: string;
  fileType: "image/jpeg" | "image/png";
}): Promise<UploadCategoryImageResponse> {
  const res = await apiClient("/categories/upload-image", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}

/**
 * Admin only. Creates a new category. `imageKey` must come from
 * uploadCategoryImageAction.
 */
export async function createCategoryAction(data: {
  name: string;
  imageKey: string;
  description: string;
}): Promise<CreateCategoryResponse> {
  const res = await apiClient("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json: CreateCategoryResponse = await res.json();

  if (json.status === "success") {
    updateTag(CATEGORY_TAGS.categories);
  }

  return json;
}

/**
 * Admin only. Updates a category. All fields are optional, but at least one
 * must be sent. Blocked if any course still references the category. If
 * `imageKey` changes, the previous image is deleted from S3 by the backend.
 */
export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    imageKey?: string;
    description?: string;
  },
): Promise<UpdateCategoryResponse> {
  const res = await apiClient(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json: UpdateCategoryResponse = await res.json();

  if (json.status === "success") {
    updateTag(CATEGORY_TAGS.categories);
    updateTag(CATEGORY_TAGS.categoryDetails(id));
  }

  return json;
}

/**
 * Admin only. Deletes a category and its S3 image. Fails if any course
 * still references the category.
 */
export async function deleteCategoryAction(
  id: string,
): Promise<DeleteCategoryResponse> {
  const res = await apiClient(`/categories/${id}`, {
    method: "DELETE",
  });

  const json: DeleteCategoryResponse = await res.json();

  if (json.status === "success") {
    updateTag(CATEGORY_TAGS.categories);
    updateTag(CATEGORY_TAGS.categoryDetails(id));
  }

  return json;
}
