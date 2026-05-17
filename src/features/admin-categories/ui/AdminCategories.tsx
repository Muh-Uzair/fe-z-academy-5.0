"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import TableImage from "@/components/TableImage";
import { formatDate } from "@/lib/utils";
import { ICategory } from "@/types/categoryTypes";
import AdminCategoriesForm, {
  type AdminCategoryFormMode,
  type AdminCategorySubmitValues,
} from "./AdminCategoriesForm";

const initialData: ICategory[] = [
  {
    _id: "cat_001",
    name: "Web Development",
    image: "https://picsum.photos/200/200?random=1",
    description: "All courses related to web development technologies.",
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-15T12:00:00Z",
  },
  {
    _id: "cat_002",
    name: "Mobile App Development",
    image: "https://picsum.photos/200/200?random=2",
    description: "Android and iOS application development courses.",
    createdAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-01-18T12:00:00Z",
  },
  {
    _id: "cat_003",
    name: "Data Science",
    image: "https://picsum.photos/200/200?random=3",
    description: "Machine learning, AI, and data analysis courses.",
    createdAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-01-20T12:00:00Z",
  },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>(initialData);
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [detailsMode, setDetailsMode] = useState<AdminCategoryFormMode>("view");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const filteredData = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      (category.description?.toLowerCase() || "").includes(search.toLowerCase())
    );
  });

  const handleCreateCategory = (values: AdminCategorySubmitValues) => {
    const timestamp = new Date().toISOString();

    console.log("create category form data", {
      name: values.name,
      description: values.description,
      imageFile: values.imageFile,
      imageFileName: values.imageFile?.name ?? null,
      imageFileType: values.imageFile?.type ?? null,
      imageUrlForBackend: values.imageUrl,
    });

    setCategories((currentCategories) => [
      {
        _id: `cat_${Date.now()}`,
        name: values.name,
        image: values.imageUrl,
        description: values.description,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ...currentCategories,
    ]);
    setIsCreateDialogOpen(false);
  };

  const handleOpenCategoryDetails = (category: ICategory) => {
    setSelectedCategory(category);
    setDetailsMode("view");
    setIsDetailsDialogOpen(true);
  };

  const handleCloseCategoryDetails = () => {
    setIsDetailsDialogOpen(false);
    setDetailsMode("view");
    setSelectedCategory(null);
  };

  const handleUpdateCategory = (values: AdminCategorySubmitValues) => {
    if (!selectedCategory) {
      return;
    }

    console.log("update category form data", {
      categoryId: selectedCategory._id,
      name: values.name,
      description: values.description,
      imageFile: values.imageFile,
      imageFileName: values.imageFile?.name ?? null,
      imageFileType: values.imageFile?.type ?? null,
      imageUrlForBackend: values.imageUrl,
    });

    const updatedCategory: ICategory = {
      ...selectedCategory,
      name: values.name,
      image: values.imageUrl,
      description: values.description,
      updatedAt: new Date().toISOString(),
    };

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === selectedCategory._id ? updatedCategory : category,
      ),
    );
    setSelectedCategory(updatedCategory);
    setDetailsMode("view");
  };

  return (
    <>
      <PageFlexCol>
        <PageHeader
          pageHeading="Categories"
          pageDescription="Manage all course categories available on the platform."
          pageHeaderLeftSection={
            <Button iconLeft={Plus} onClick={() => setIsCreateDialogOpen(true)}>
              Add Category
            </Button>
          }
        />

        <AppTable
          upperHeader={
            <div className="max-w-sm">
              <AppSearchBar
                placeholder="Search categories..."
                onChange={(value: string) => setSearch(value)}
              />
            </div>
          }
          data={filteredData}
          columns={[
            {
              key: "image",
              label: "Image",
              render: (value: string | null, row: ICategory) => (
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
              render: (_: unknown, row: ICategory) => (
                <div className="text-right">
                  <Button onClick={() => handleOpenCategoryDetails(row)}>
                    View
                  </Button>
                </div>
              ),
            },
          ]}
          pagination={true}
        />
      </PageFlexCol>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new course category with its name, image, and description.
            </DialogDescription>
          </DialogHeader>
          <AdminCategoriesForm
            mode="create"
            onSubmit={handleCreateCategory}
            onClose={() => setIsCreateDialogOpen(false)}
          />
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
          <DialogHeader>
            <DialogTitle>
              {detailsMode === "edit" ? "Edit Category" : "View Category"}
            </DialogTitle>
            <DialogDescription>
              {detailsMode === "edit"
                ? "Update the selected category and save your changes."
                : "Review the category details, then switch to edit mode if needed."}
            </DialogDescription>
          </DialogHeader>
          {selectedCategory ? (
            <AdminCategoriesForm
              key={`${selectedCategory._id}-${detailsMode}-${selectedCategory.updatedAt}`}
              mode={detailsMode}
              initialData={selectedCategory}
              onSubmit={handleUpdateCategory}
              onClose={handleCloseCategoryDetails}
              onModeChange={setDetailsMode}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCategories;
