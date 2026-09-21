"use client";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import AppButton from "@/components/AppButton";
import AppEnrollmentCardsGridLayout from "@/components/AppEnrollmentCardsGridLayout";
import PageFlexCol from "@/components/PageFlexCol";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

type AdminEnrollmentsProps = {
  enrollments: Enrollment[];
  pagination: Pagination;
};

const AdminEnrollments = ({
  enrollments,
  pagination,
}: AdminEnrollmentsProps) => {
  const router = useRouter();

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Enrollments"
        pageDescription="View all student enrollments across the academy."
      />

      <AppEnrollmentCardsGridLayout
        enrollments={enrollments}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => router.push(`/admin/enrollments?page=${page}`)}
        renderFooter={(enrollment) => (
          <AppButton
            href={`/course-details/${enrollment.courseDetails._id}?role=admin`}
            className="w-full"
          >
            View Course
          </AppButton>
        )}
      />
    </PageFlexCol>
  );
};

export default AdminEnrollments;
