"use client";

import { useRouter } from "next/navigation";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import type {
  CourseListItem,
  CourseCategorySummary,
} from "@/response-types/courseResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import {
  formatCourseLevel,
  getCourseVerificationBadgeVariant,
  getCourseVerificationLabel,
  truncateText,
} from "@/features/course-management/courseHelpers";

const TRUNCATE_REASON_AT = 60;

type PendingVerificationsProps = {
  courses: CourseListItem[];
  pagination: Pagination;
  search: string;
};

const PendingVerifications = ({
  courses,
  pagination,
  search,
}: PendingVerificationsProps) => {
  const router = useRouter();

  const updateQuery = (next: { search?: string; page?: number }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(
      `/instructor/my-courses/pending-verifications${query ? `?${query}` : ""}`,
    );
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Pending Course Verifications"
        pageDescription="Review your courses that are still awaiting admin approval or were sent back with feedback."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search pending courses..."
              defaultValue={search}
              onChange={(value: string) =>
                updateQuery({ search: value, page: 1 })
              }
            />
          </div>
        }
        data={courses}
        columns={[
          {
            key: "thumbnailUrl",
            label: "Thumbnail",
            render: (value: string, row: CourseListItem) => (
              <TableImage src={value} alt={row.title} shape="rectangle" />
            ),
          },
          {
            key: "title",
            label: "Title",
            render: (value: string) => (
              <span className="font-medium">{value}</span>
            ),
          },
          {
            key: "price",
            label: "Price",
            render: (value: number) => `$${value}`,
          },
          {
            key: "level",
            label: "Level",
            render: (value: string) => formatCourseLevel(value),
          },
          {
            key: "categoryDetails",
            label: "Category",
            render: (value: CourseCategorySummary) => value.name,
          },
          {
            key: "isVerified",
            label: "Verification",
            render: (_: boolean, row: CourseListItem) => (
              <Badge variant={getCourseVerificationBadgeVariant(row)}>
                {getCourseVerificationLabel(row)}
              </Badge>
            ),
          },
          {
            key: "verificationRejectionReason",
            label: "Verification Rejection Reason",
            render: (value: string | null) => (
              <span title={value ?? "Not reviewed yet"}>
                {value
                  ? truncateText(value, TRUNCATE_REASON_AT)
                  : "Not reviewed yet"}
              </span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseListItem) => (
              <AppButton href={`/course-details/${row._id}?role=instructor`}>
                View Details
              </AppButton>
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

export default PendingVerifications;
