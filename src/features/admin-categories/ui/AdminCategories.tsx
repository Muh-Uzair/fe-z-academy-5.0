"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import TableImage from "@/components/TableImage";
import { formatDate } from "@/lib/utils";
import { ICategory } from "@/types/categoryTypes";

const data: ICategory[] = [
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
  const [search, setSearch] = useState("");

  const filteredData = data.filter((category) => {
    return (
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      (category.description?.toLowerCase() || "").includes(search.toLowerCase())
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Categories"
        pageDescription="Manage all course categories available on the platform."
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
                <Button onClick={() => console.log("view category", row._id)}>
                  View
                </Button>
              </div>
            ),
          },
        ]}
        pagination={true}
      />
    </PageFlexCol>
  );
};

export default AdminCategories;
