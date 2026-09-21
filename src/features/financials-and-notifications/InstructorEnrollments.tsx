"use client";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import AppButton from "@/components/AppButton";
import AppEnrollmentCardsGridLayout from "@/components/AppEnrollmentCardsGridLayout";
import PageFlexCol from "@/components/PageFlexCol";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

type InstructorEnrollmentsProps = {
  enrollments: Enrollment[];
  pagination: Pagination;
};

const InstructorEnrollments = ({
  enrollments,
  pagination,
}: InstructorEnrollmentsProps) => {
  const router = useRouter();
  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Course Enrollments"
        pageDescription="View students enrolled in your courses."
      />

      <AppEnrollmentCardsGridLayout
        enrollments={enrollments}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) =>
          router.push(`/instructor/enrollments?page=${page}`)
        }
        renderFooter={(enrollment) => (
          <AppButton
            href={`/course-details/${enrollment.courseDetails._id}?role=instructor`}
            className="w-full"
          >
            View Course
          </AppButton>
        )}
      />
    </PageFlexCol>
  );
};

export default InstructorEnrollments;
