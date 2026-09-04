"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AppButton from "@/components/AppButton";
import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import TableImage from "@/components/TableImage";
import { formatDate } from "@/utils/time";
import useClientAction from "@/hooks/useClientAction";
import {
  uploadCategoryImageAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/services/category/actions";
import type {
  Category,
  UploadCategoryImageResponse,
} from "@/response-types/categoryResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import AdminCategoriesForm, {
  type AdminCategoryFormMode,
  type AdminCategorySubmitValues,
} from "./AdminCategoriesForm";

type AdminCategoriesProps = {
  categories: Category[];
  pagination: Pagination;
  search: string;
};

async function uploadImageToS3(
  uploadData: Extract<
    UploadCategoryImageResponse,
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

const AdminCategories = ({
  categories,
  pagination,
  search,
}: AdminCategoriesProps) => {
  console.log("categories ---------------------------- \n", categories);
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [detailsMode, setDetailsMode] = useState<AdminCategoryFormMode>("view");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const { run: runCreateAction, isLoading: isCreating } = useClientAction();
  const { run: runUpdateAction, isLoading: isUpdating } = useClientAction();
  const { run: runDeleteAction, isLoading: isDeleting } = useClientAction();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/admin/categories${query ? `?${query}` : ""}`);
  };

  const handleCreateCategory = async (values: AdminCategorySubmitValues) => {
    if (!values.imageFile) {
      return;
    }

    const imageFile = values.imageFile;

    const response = await runCreateAction(async () => {
      const uploadResponse = await uploadCategoryImageAction({
        fileName: imageFile.name,
        fileType: imageFile.type as "image/jpeg" | "image/png",
      });

      if (uploadResponse.status !== "success") {
        return uploadResponse;
      }

      const uploaded = await uploadImageToS3(uploadResponse.data, imageFile);

      if (!uploaded) {
        return {
          status: "error" as const,
          message: "Failed to upload the category image. Please try again.",
          data: null,
        };
      }

      return createCategoryAction({
        name: values.name,
        description: values.description,
        imageKey: uploadResponse.data.key,
      });
    });

    if (response?.status === "success") {
      setIsCreateDialogOpen(false);
      router.refresh();
    }
  };

  const handleOpenCategoryDetails = (category: Category) => {
    setSelectedCategory(category);
    setDetailsMode("view");
    setIsDetailsDialogOpen(true);
  };

  const handleCloseCategoryDetails = () => {
    setIsDetailsDialogOpen(false);
    setDetailsMode("view");
    setSelectedCategory(null);
  };

  const handleUpdateCategory = async (values: AdminCategorySubmitValues) => {
    if (!selectedCategory) {
      return;
    }

    const categoryId = selectedCategory._id;
    const imageFile = values.imageFile;

    const response = await runUpdateAction(async () => {
      let imageKey: string | undefined;

      if (imageFile) {
        const uploadResponse = await uploadCategoryImageAction({
          fileName: imageFile.name,
          fileType: imageFile.type as "image/jpeg" | "image/png",
        });

        if (uploadResponse.status !== "success") {
          return uploadResponse;
        }

        const uploaded = await uploadImageToS3(uploadResponse.data, imageFile);

        if (!uploaded) {
          return {
            status: "error" as const,
            message: "Failed to upload the category image. Please try again.",
            data: null,
          };
        }

        imageKey = uploadResponse.data.key;
      }

      return updateCategoryAction(categoryId, {
        name: values.name,
        description: values.description,
        ...(imageKey ? { imageKey } : {}),
      });
    });

    if (response?.status === "success") {
      handleCloseCategoryDetails();
      router.refresh();
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) {
      return;
    }

    const response = await runDeleteAction(() =>
      deleteCategoryAction(categoryToDelete._id),
    );

    if (response?.status === "success") {
      setCategoryToDelete(null);
      router.refresh();
    }
  };

  return (
    <>
      <PageFlexCol>
        <PageHeader
          pageHeading="Categories"
          pageDescription="Manage all course categories available on the platform."
          pageHeaderRightSection={
            <AppButton
              iconLeft={Plus}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Add Category
            </AppButton>
          }
        />

        <AppTable
          upperHeader={
            <div className="max-w-sm">
              <AppSearchBar
                placeholder="Search categories..."
                defaultValue={search}
                onChange={(value: string) =>
                  updateQuery({ search: value, page: 1 })
                }
              />
            </div>
          }
          data={categories}
          columns={[
            {
              key: "imageUrl",
              label: "Image",
              render: (value: string | null, row: Category) => (
                <TableImage src={value} alt={row.name} shape="rectangle" />
              ),
            },
            {
              key: "name",
              label: "Name",
              render: (value: string) => (
                <span className="font-medium">{value}</span>
              ),
            },
            {
              key: "description",
              label: "Description",
              render: (value: string | null) =>
                value ? (
                  <span className="block max-w-md truncate" title={value}>
                    {value}
                  </span>
                ) : (
                  "No description"
                ),
            },
            {
              key: "createdAt",
              label: "Created At",
              render: (value: string) => formatDate(value),
            },
            {
              key: "action",
              label: "Action",
              render: (_: unknown, row: Category) => (
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenCategoryDetails(row)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setCategoryToDelete(row)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ),
            },
          ]}
          pagination={true}
          paginationMeta={pagination}
          onPageChange={(page) => updateQuery({ page })}
        />
      </PageFlexCol>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader variant="create">
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new course category with its name, image, and description.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <AdminCategoriesForm
              mode="create"
              onSubmit={handleCreateCategory}
              onClose={() => setIsCreateDialogOpen(false)}
              isLoading={isCreating}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailsDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseCategoryDetails();
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader variant={detailsMode === "edit" ? "info" : "default"}>
            <DialogTitle>
              {detailsMode === "edit" ? "Edit Category" : "View Category"}
            </DialogTitle>
            <DialogDescription>
              {detailsMode === "edit"
                ? "Update the selected category and save your changes."
                : "Review the category details, then switch to edit mode if needed."}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {selectedCategory ? (
              <AdminCategoriesForm
                key={`${selectedCategory._id}-${detailsMode}-${selectedCategory.updatedAt}`}
                mode={detailsMode}
                initialData={selectedCategory}
                onSubmit={handleUpdateCategory}
                onClose={handleCloseCategoryDetails}
                onModeChange={setDetailsMode}
                isLoading={isUpdating}
              />
            ) : null}
          </DialogBody>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{categoryToDelete?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleConfirmDeleteCategory();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminCategories;
