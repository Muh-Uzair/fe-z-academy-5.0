"use client";

import { useRouter } from "next/navigation";

import AppButton from "@/components/AppButton";
import AppEnrollmentCardsGridLayout from "@/components/AppEnrollmentCardsGridLayout";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

type StudentEnrollmentsProps = {
  enrollments: Enrollment[];
  pagination: Pagination;
};

const StudentEnrollments = ({
  enrollments,
  pagination,
}: StudentEnrollmentsProps) => {
  const router = useRouter();

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="My Enrollments"
        pageDescription="View the courses you have enrolled in and track your learning progress."
      />

      <AppEnrollmentCardsGridLayout
        enrollments={enrollments}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => router.push(`/student/enrollments?page=${page}`)}
        renderFooter={(enrollment) => (
          <AppButton
            href={`/course-details/${enrollment.courseDetails._id}?role=student&source=enrolled`}
            className="w-full"
          >
            View Course
          </AppButton>
        )}
      />
    </PageFlexCol>
  );
};

export default StudentEnrollments;
