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
  instructorCoursesMockData,
  type InstructorCourseRecord,
} from "./instructorCourseMockData";

const LOGGED_IN_INSTRUCTOR_ID = "user_001";
const TRUNCATE_REASON_AT = 60;

const getVerificationLabel = (course: InstructorCourseRecord) =>
  course.isVerified ? "Verified" : "Not Verified";

const truncateReason = (reason: string | null) => {
  if (!reason) {
    return "Not reviewed yet";
  }

  if (reason.length <= TRUNCATE_REASON_AT) {
    return reason;
  }

  return `${reason.slice(0, TRUNCATE_REASON_AT).trimEnd()}...`;
};

const PendingVerifications = () => {
  const [search, setSearch] = useState("");

  const filteredCourses = instructorCoursesMockData.filter((course) => {
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
      getVerificationLabel(course).toLowerCase().includes(normalizedSearch) ||
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
            render: (value: string, row: InstructorCourseRecord) => (
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
            render: (value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1),
          },
          {
            key: "categoryName",
            label: "Category",
          },
          {
            key: "isVerified",
            label: "Verified",
            render: (_: boolean, row: InstructorCourseRecord) => (
              <Badge variant={row.isVerified ? "default" : "secondary"}>
                {getVerificationLabel(row)}
              </Badge>
            ),
          },
          {
            key: "verificationRejectionReason",
            label: "Verification Feedback",
            render: (value: string | null) => (
              <span title={value ?? "Not reviewed yet"}>
                {truncateReason(value)}
              </span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: InstructorCourseRecord) => (
              <Button asChild>
                <Link href={`/instructor/my-courses/course-details/${row._id}`}>
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
