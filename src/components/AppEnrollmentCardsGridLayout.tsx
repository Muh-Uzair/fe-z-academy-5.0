"use client";

import React, { ReactNode } from "react";

import EnrollmentCard from "@/components/EnrollmentCard";
import { Button } from "@/components/ui/button";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

interface AppEnrollmentCardsGridLayoutProps {
  enrollments: Enrollment[];
  paginationMeta?: Pagination;
  pagination?: boolean;
  renderFooter?: (enrollment: Enrollment) => ReactNode;
  onPageChange?: (page: number) => void;
}

const AppEnrollmentCardsGridLayout = ({
  enrollments = [],
  paginationMeta,
  pagination = false,
  renderFooter,
  onPageChange,
}: AppEnrollmentCardsGridLayoutProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <EnrollmentCard
            key={enrollment._id}
            enrollment={enrollment}
            footer={renderFooter?.(enrollment)}
          />
        ))}
      </div>

      {pagination && paginationMeta && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {enrollments.length} of {paginationMeta.totalDocuments}{" "}
            enrollments
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!paginationMeta.hasPrevPage}
              onClick={() => onPageChange?.(paginationMeta.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!paginationMeta.hasNextPage}
              onClick={() => onPageChange?.(paginationMeta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppEnrollmentCardsGridLayout;
