"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import AppButton from "@/components/AppButton";

import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import TableImage from "@/components/TableImage";
import InstructorVerificationBadge from "@/components/InstructorVerificationBadge";
import PageHeader from "@/components/PageHeader";
import AppTable from "@/components/AppTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";

type IsVerifiedFilter = "all" | "true" | "false";

type AllInstructorsProps = {
  instructors: UserDetails[];
  pagination: Pagination;
  search: string;
  isVerified: IsVerifiedFilter;
};

// CMP CMP CMP
const AllInstructors = ({
  instructors,
  pagination,
  search,
  isVerified,
}: AllInstructorsProps) => {
  // VARS
  const router = useRouter();

  // FUNCTIONS
  const updateQuery = (next: {
    search?: string;
    page?: number;
    isVerified?: IsVerifiedFilter;
  }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;
    const nextIsVerified = next.isVerified ?? isVerified;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextIsVerified !== "all") searchParams.set("isVerified", nextIsVerified);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(
      `/admin/instructors/all-instructors${query ? `?${query}` : ""}`,
    );
  };

  // JSX JSX JSX
  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="All Instructors"
        pageDescription="Browse and manage every instructor account on the platform."
      />

      <AppTable
        upperHeader={
          <div className="flex flex-wrap items-center gap-3">
            <div className="max-w-sm flex-1">
              <AppSearchBar
                placeholder="Search instructors by name or email..."
                defaultValue={search}
                onChange={(value: string) =>
                  updateQuery({ search: value, page: 1 })
                }
              />
            </div>

            <Select
              value={isVerified}
              onValueChange={(value: IsVerifiedFilter) =>
                updateQuery({ isVerified: value, page: 1 })
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Not verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        data={instructors}
        columns={[
          {
            key: "avatar",
            label: "Avatar",
            render: (value: string, row: { fullName: string }) => (
              <TableImage
                src={value}
                alt={row.fullName}
                shape="circle"
                fallbackIcon={User}
              />
            ),
          },
          {
            key: "fullName",
            label: "Full Name",
            render: (value: string) => (
              <span className="font-medium">{value}</span>
            ),
          },
          {
            key: "email",
            label: "Email",
          },
          {
            key: "highestEducation",
            label: "Highest Education",
          },
          {
            key: "yearsOfExperience",
            label: "Experience",
            render: (value: number) => `${value} Years`,
          },
          {
            key: "isVerified",
            label: "Verified",
            render: (value: boolean) => (
              <InstructorVerificationBadge isVerified={value} />
            ),
          },
          {
            key: "role",
            label: "Role",
            render: (value: string) => (
              <span className="capitalize">{value}</span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: { _id: string }) => (
              <div className="text-right">
                <AppButton
                  onClick={() =>
                    router.push(
                      `/admin/instructors/instructor-details/${row._id}`,
                    )
                  }
                >
                  View
                </AppButton>
              </div>
            ),
          },
        ]}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
      />
    </PageFlexCol>
  );
};

export default AllInstructors;
