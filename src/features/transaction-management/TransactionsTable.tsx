"use client";

import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppSearchBar from "@/components/AppSearchBar";
import AppButton from "@/components/AppButton";
import AppTable from "@/components/AppTable";
import PagedSearchSelect from "@/components/PagedSearchSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatusBadge, formatCurrency } from "./transactionHelpers";
import type {
  Transaction,
  TransactionCourseSummary,
  TransactionUserSummary,
} from "@/response-types/transactionResponseTypes";
import type { Pagination, UserDetails } from "@/response-types/userResponseTypes";

type PaymentStatusFilter = "all" | Transaction["paymentStatus"];

const ALL_INSTRUCTORS_ITEM = { id: "", label: "All instructors" };
const ALL_COURSES_ITEM = { id: "", label: "All courses" };

type InstructorFilterProps = {
  instructors: UserDetails[];
  instructorsPagination: Pagination;
  instructorSearch: string;
  instructor: string;
  selectedInstructorLabel: string | null;
};

type CourseFilterProps = {
  courses: { _id: string; title: string }[];
  coursesPagination: Pagination;
  courseSearch: string;
  course: string;
  selectedCourseLabel: string | null;
};

type TransactionsTableProps = {
  basePath: string;
  transactions: Transaction[];
  pagination: Pagination;
  search: string;
  paymentStatus: PaymentStatusFilter;
  showStudentColumn?: boolean;
  showInstructorColumn?: boolean;
  instructorFilter?: InstructorFilterProps;
  courseFilter?: CourseFilterProps;
};

const TransactionsTable = ({
  basePath,
  transactions,
  pagination,
  search,
  paymentStatus,
  showStudentColumn = true,
  showInstructorColumn = true,
  instructorFilter,
  courseFilter,
}: TransactionsTableProps) => {
  const router = useRouter();

  const updateQuery = (next: {
    search?: string;
    page?: number;
    paymentStatus?: PaymentStatusFilter;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: number;
    course?: string;
    courseSearch?: string;
    coursePage?: number;
  }) => {
    const nextSearch = next.search ?? search;
    const nextPage = next.page ?? pagination.page ?? 1;
    const nextPaymentStatus = next.paymentStatus ?? paymentStatus;
    const nextInstructor = next.instructor ?? instructorFilter?.instructor;
    const nextInstructorSearch =
      next.instructorSearch ?? instructorFilter?.instructorSearch;
    const nextInstructorPage =
      next.instructorPage ?? instructorFilter?.instructorsPagination.page ?? 1;
    const nextCourse = next.course ?? courseFilter?.course;
    const nextCourseSearch = next.courseSearch ?? courseFilter?.courseSearch;
    const nextCoursePage =
      next.coursePage ?? courseFilter?.coursesPagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextPaymentStatus !== "all")
      searchParams.set("paymentStatus", nextPaymentStatus);
    if (instructorFilter) {
      if (nextInstructor) searchParams.set("instructor", nextInstructor);
      if (nextInstructorSearch)
        searchParams.set("instructorSearch", nextInstructorSearch);
      if (nextInstructorPage > 1)
        searchParams.set("instructorPage", String(nextInstructorPage));
    }
    if (courseFilter) {
      if (nextCourse) searchParams.set("course", nextCourse);
      if (nextCourseSearch) searchParams.set("courseSearch", nextCourseSearch);
      if (nextCoursePage > 1)
        searchParams.set("coursePage", String(nextCoursePage));
    }
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`${basePath}${query ? `?${query}` : ""}`);
  };

  const columns = [
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (value: string) => (
        <span className="font-mono text-[11px]">{value}</span>
      ),
    },
    ...(showStudentColumn
      ? [
          {
            key: "studentDetails",
            label: "Student",
            render: (value: TransactionUserSummary) => value.fullName,
          },
        ]
      : []),
    {
      key: "courseDetails",
      label: "Course",
      render: (value: TransactionCourseSummary) => (
        <span className="line-clamp-1">{value.title}</span>
      ),
    },
    ...(showInstructorColumn
      ? [
          {
            key: "instructorDetails",
            label: "Instructor",
            render: (value: TransactionUserSummary) => value.fullName,
          },
        ]
      : []),
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (value: number, row: Transaction) =>
        formatCurrency(value, row.currency),
    },
    {
      key: "paymentStatus",
      label: "Status",
      render: (value: Transaction["paymentStatus"]) => (
        <PaymentStatusBadge status={value} />
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "action",
      label: "Action",
      render: (_: unknown, row: Transaction) => (
        <div className="text-right">
          <AppButton onClick={() => router.push(`${basePath}/${row._id}`)}>
            View
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Transactions"
        pageDescription="Browse and review course payment transactions."
      />

      <AppTable
        upperHeader={
          <div className="flex flex-wrap items-center gap-3">
            <div className="max-w-sm flex-1">
              <AppSearchBar
                placeholder="Search by transaction ID..."
                defaultValue={search}
                onChange={(value: string) =>
                  updateQuery({ search: value, page: 1 })
                }
              />
            </div>

            <Select
              value={paymentStatus}
              onValueChange={(value: PaymentStatusFilter) =>
                updateQuery({ paymentStatus: value, page: 1 })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refund_processing">
                  Refund Processing
                </SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {instructorFilter ? (
              <div className="w-[220px]">
                <PagedSearchSelect
                  items={[
                    ALL_INSTRUCTORS_ITEM,
                    ...instructorFilter.instructors.map((instructorOption) => ({
                      id: instructorOption._id,
                      label: instructorOption.fullName,
                    })),
                  ]}
                  pagination={instructorFilter.instructorsPagination}
                  search={instructorFilter.instructorSearch}
                  value={instructorFilter.instructor}
                  onValueChange={(value) =>
                    updateQuery({ instructor: value, page: 1 })
                  }
                  onSearchChange={(value) =>
                    updateQuery({ instructorSearch: value, instructorPage: 1 })
                  }
                  onPageChange={(value) =>
                    updateQuery({ instructorPage: value })
                  }
                  selectedLabel={
                    instructorFilter.instructor
                      ? instructorFilter.selectedInstructorLabel
                      : "All instructors"
                  }
                  placeholder="Filter by instructor"
                  searchPlaceholder="Search instructors..."
                />
              </div>
            ) : null}

            {courseFilter ? (
              <div className="w-[220px]">
                <PagedSearchSelect
                  items={[
                    ALL_COURSES_ITEM,
                    ...courseFilter.courses.map((courseOption) => ({
                      id: courseOption._id,
                      label: courseOption.title,
                    })),
                  ]}
                  pagination={courseFilter.coursesPagination}
                  search={courseFilter.courseSearch}
                  value={courseFilter.course}
                  onValueChange={(value) =>
                    updateQuery({ course: value, page: 1 })
                  }
                  onSearchChange={(value) =>
                    updateQuery({ courseSearch: value, coursePage: 1 })
                  }
                  onPageChange={(value) => updateQuery({ coursePage: value })}
                  selectedLabel={
                    courseFilter.course
                      ? courseFilter.selectedCourseLabel
                      : "All courses"
                  }
                  placeholder="Filter by course"
                  searchPlaceholder="Search courses..."
                />
              </div>
            ) : null}
          </div>
        }
        data={transactions}
        columns={columns}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
      />
    </PageFlexCol>
  );
};

export default TransactionsTable;
