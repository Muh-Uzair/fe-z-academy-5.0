"use client";

import { useRouter } from "next/navigation";

import AppButton from "@/components/AppButton";
import AppEnrollmentCardsGridLayout from "@/components/AppEnrollmentCardsGridLayout";
import PagedSearchSelect from "@/components/PagedSearchSelect";
import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { CourseListItem } from "@/response-types/courseResponseTypes";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";

type CourseFilterProps = {
  courses: CourseListItem[];
  coursesPagination: Pagination;
  courseSearch: string;
  course: string;
  selectedCourseLabel: string | null;
};

type InstructorFilterProps = {
  instructors: UserDetails[];
  instructorsPagination: Pagination;
  instructorSearch: string;
  instructor: string;
  selectedInstructorLabel: string | null;
};

type StudentEnrollmentsProps = {
  enrollments: Enrollment[];
  pagination: Pagination;
  courseFilter: CourseFilterProps;
  instructorFilter: InstructorFilterProps;
  watchedCompletely: "all" | "true" | "false";
  certificateIssued: "all" | "true" | "false";
};

const ALL_COURSES_ITEM = { id: "", label: "All courses" };
const ALL_INSTRUCTORS_ITEM = { id: "", label: "All instructors" };

const StudentEnrollments = ({
  enrollments,
  pagination,
  courseFilter,
  instructorFilter,
  watchedCompletely,
  certificateIssued,
}: StudentEnrollmentsProps) => {
  const router = useRouter();

  const updateQuery = (next: {
    page?: number;
    course?: string;
    courseSearch?: string;
    coursePage?: number;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: number;
    watchedCompletely?: "all" | "true" | "false";
    certificateIssued?: "all" | "true" | "false";
  }) => {
    const nextCourse = next.course ?? courseFilter.course;
    const nextCourseSearch = next.courseSearch ?? courseFilter.courseSearch;
    const nextCoursePage =
      next.coursePage ?? courseFilter.coursesPagination.page ?? 1;
    const nextInstructor = next.instructor ?? instructorFilter.instructor;
    const nextInstructorSearch =
      next.instructorSearch ?? instructorFilter.instructorSearch;
    const nextInstructorPage =
      next.instructorPage ??
      instructorFilter.instructorsPagination.page ??
      1;
    const nextWatchedCompletely =
      next.watchedCompletely ?? watchedCompletely;
    const nextCertificateIssued =
      next.certificateIssued ?? certificateIssued;
    const nextPage = next.page ?? pagination.page ?? 1;

    const searchParams = new URLSearchParams();
    if (nextCourse) searchParams.set("course", nextCourse);
    if (nextCourseSearch) {
      searchParams.set("courseSearch", nextCourseSearch);
    }
    if (nextCoursePage > 1) {
      searchParams.set("coursePage", String(nextCoursePage));
    }
    if (nextInstructor) searchParams.set("instructor", nextInstructor);
    if (nextInstructorSearch) {
      searchParams.set("instructorSearch", nextInstructorSearch);
    }
    if (nextInstructorPage > 1) {
      searchParams.set("instructorPage", String(nextInstructorPage));
    }
    if (nextWatchedCompletely !== "all") {
      searchParams.set("watchedCompletely", nextWatchedCompletely);
    }
    if (nextCertificateIssued !== "all") {
      searchParams.set("certificateIssued", nextCertificateIssued);
    }
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/student/enrollments${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="My Enrollments"
        pageDescription="View the courses you have enrolled in and track your learning progress."
      />

      <div className="flex flex-wrap items-center gap-3">
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
            onValueChange={(value) => updateQuery({ course: value, page: 1 })}
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
            onPageChange={(value) => updateQuery({ instructorPage: value })}
            selectedLabel={
              instructorFilter.instructor
                ? instructorFilter.selectedInstructorLabel
                : "All instructors"
            }
            placeholder="Filter by instructor"
            searchPlaceholder="Search instructors..."
          />
        </div>
        <Select
          value={watchedCompletely}
          onValueChange={(value: "all" | "true" | "false") =>
            updateQuery({ watchedCompletely: value, page: 1 })
          }
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Completion status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All completion statuses</SelectItem>
            <SelectItem value="true">Completed</SelectItem>
            <SelectItem value="false">In progress</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={certificateIssued}
          onValueChange={(value: "all" | "true" | "false") =>
            updateQuery({ certificateIssued: value, page: 1 })
          }
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Certificate status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All certificate statuses</SelectItem>
            <SelectItem value="true">Certificate issued</SelectItem>
            <SelectItem value="false">Certificate not issued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AppEnrollmentCardsGridLayout
        enrollments={enrollments}
        pagination={true}
        paginationMeta={pagination}
        onPageChange={(page) => updateQuery({ page })}
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
