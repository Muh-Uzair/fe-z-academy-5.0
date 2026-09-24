import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { apiClient } from "@/lib/apiClient";
import { buildQueryString } from "@/lib/buildQueryString";
import { CATEGORY_TAGS } from "./tags";
import type {
  GetCategoriesResponse,
  GetCategoryDetailsResponse,
  GetTopCategoriesResponse,
} from "@/response-types/categoryResponseTypes";

// Each query below throws on a non-success response instead of returning it,
// so the resolved type only ever needs to describe the success shape.
type GetCategoriesSuccessResponse = Extract<
  GetCategoriesResponse,
  { status: "success" }
>;
type GetCategoryDetailsSuccessResponse = Extract<
  GetCategoryDetailsResponse,
  { status: "success" }
>;

type GetTopCategoriesSuccessResponse = Extract<
  GetTopCategoriesResponse,
  { status: "success" }
>;

type GetCategoriesParams = {
  search?: string;
  projection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Public. Fetches a paginated, sortable, searchable list of categories.
 * Shared cache — the same result is served to every caller.
 * Use updateTag(CATEGORY_TAGS.categories) to invalidate this after a
 * create/update/delete.
 */
export async function getCategoriesQuery(
  params: GetCategoriesParams = {},
): Promise<GetCategoriesSuccessResponse> {
  "use cache";
  cacheTag(CATEGORY_TAGS.categories);
  cacheLife("minutes");

  const query = buildQueryString(params);

  try {
    const res = await apiClient(
      `/categories${query}`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetCategoriesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCategoriesQuery failed:", err);
    throw err;
  }
}

/**
 * Public. Fetches a single category by id.
 * Shared cache — the same result is served to every caller.
 * Use updateTag(CATEGORY_TAGS.categoryDetails(id)) to invalidate this after
 * an update.
 */
export async function getCategoryDetailsQuery(
  id: string,
): Promise<GetCategoryDetailsSuccessResponse> {
  "use cache";
  cacheTag(CATEGORY_TAGS.categoryDetails(id));
  cacheLife("minutes");

  try {
    const res = await apiClient(
      `/categories/${id}`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetCategoryDetailsResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getCategoryDetailsQuery failed:", err);
    throw err;
  }
}

/**
 * Public. Fetches the top categories based on course count.
 * Shared cache — the same result is served to every caller.
 * Use updateTag(CATEGORY_TAGS.topCategories) to invalidate this after
 * an update that affects course counts.
 */
export async function getTopCategoriesQuery(): Promise<GetTopCategoriesSuccessResponse> {
  "use cache";
  cacheTag(CATEGORY_TAGS.topCategories);
  cacheLife("minutes");

  try {
    const res = await apiClient(
      `/categories/top`,
      { method: "GET" },
      { includeCookies: false },
    );
    const json: GetTopCategoriesResponse = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    console.error("getTopCategoriesQuery failed:", err);
    throw err;
  }
}
