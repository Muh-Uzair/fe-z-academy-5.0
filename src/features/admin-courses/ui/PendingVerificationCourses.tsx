"use client";

import Link from "next/link";
import { useState } from "react";

import AppSearchBar from "@/components/AppSearchBar";
import AppTable from "@/components/AppTable";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import TableImage from "@/components/TableImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  courseMockData,
  type CourseRecord,
} from "@/features/course-management/ui/courseMockData";
import {
  formatCourseLevel,
  getCourseVerificationBadgeVariant,
  getCourseVerificationLabel,
  getCourseVerificationState,
  truncateText,
} from "@/features/course-management/ui/courseHelpers";

const TRUNCATE_REASON_AT = 70;

const PendingVerificationCourses = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = courseMockData.filter((course) => {
    if (getCourseVerificationState(course) === "verified") {
      return false;
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.instructorName.toLowerCase().includes(normalizedSearch) ||
      course.categoryName.toLowerCase().includes(normalizedSearch) ||
      (course.verificationRejectionReason ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Pending Verification Courses"
        pageDescription="Review courses that are still awaiting admin approval or already have rejection feedback saved."
      />

      <AppTable
        upperHeader={
          <div className="max-w-sm">
            <AppSearchBar
              placeholder="Search pending courses..."
              onChange={(value: string) => setSearch(value)}
            />
          </div>
        }
        data={filteredCourses}
        columns={[
          {
            key: "thumbnail",
            label: "Thumbnail",
            render: (value: string, row: CourseRecord) => (
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
            key: "instructorName",
            label: "Instructor",
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
            key: "categoryName",
            label: "Category",
          },
          {
            key: "isVerified",
            label: "Verified",
            render: (_: boolean, row: CourseRecord) => (
              <>
                {row.isVerified === false && (
                  <Badge variant="destructive">Not verified</Badge>
                )}
                {row.isVerified && <Badge>Verified</Badge>}
              </>
            ),
          },
          {
            key: "verificationRejectionReason",
            label: "Verification Rejection Reason",
            render: (value: string | null) => (
              <span title={value ?? "No rejection reason yet"}>
                {value
                  ? truncateText(value, TRUNCATE_REASON_AT)
                  : "Not reviewed yet"}
              </span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: CourseRecord) => (
              <Button asChild>
                <Link
                  href={`/course-details/${row._id}?role=admin&review=true`}
                >
                  View Details
                </Link>
              </Button>
            ),
          },
        ]}
        pagination={true}
      />
    </PageFlexCol>
  );
};

export default PendingVerificationCourses;
