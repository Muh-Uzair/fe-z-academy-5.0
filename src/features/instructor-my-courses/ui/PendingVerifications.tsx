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
import { coursesData as courseMockData } from "@/dummy-data";
import { type CourseRecord } from "@/types/courseTypes";
import {
  formatCourseLevel,
  getCourseVerificationLabel,
  truncateText,
} from "@/features/course-management/ui/courseHelpers";

const LOGGED_IN_INSTRUCTOR_ID = "user_001";
const TRUNCATE_REASON_AT = 60;

const PendingVerifications = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = courseMockData.filter((course) => {
    const belongsToInstructor = course.instructor === LOGGED_IN_INSTRUCTOR_ID;
    const isPendingOrRejected = !course.isVerified;

    if (!belongsToInstructor || !isPendingOrRejected) {
      return false;
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.categoryName.toLowerCase().includes(normalizedSearch) ||
      course.level.toLowerCase().includes(normalizedSearch) ||
      getCourseVerificationLabel(course, "simple")
        .toLowerCase()
        .includes(normalizedSearch) ||
      (course.verificationRejectionReason ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

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
            render: (_: unknown, row: CourseRecord) => (
              <Button asChild>
                <Link href={`/course-details/${row._id}?role=instructor`}>
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

export default PendingVerifications;
