"use client";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import AppButton from "@/components/AppButton";
import AppEnrollmentCardsGridLayout from "@/components/AppEnrollmentCardsGridLayout";
import PagedSearchSelect from "@/components/PagedSearchSelect";
import PageFlexCol from "@/components/PageFlexCol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type {
  Pagination,
  UserDetails,
} from "@/response-types/userResponseTypes";
import type { CourseListItem } from "@/response-types/courseResponseTypes";

type StudentFilterProps = {
  students: UserDetails[];
  studentsPagination: Pagination;
  studentSearch: string;
  student: string;
  selectedStudentLabel: string | null;
};

type CourseFilterProps = {
  courses: CourseListItem[];
  coursesPagination: Pagination;
  courseSearch: string;
  course: string;
  selectedCourseLabel: string | null;
};

type InstructorEnrollmentsProps = {
  enrollments: Enrollment[];
  pagination: Pagination;
  studentFilter: StudentFilterProps;
  courseFilter: CourseFilterProps;
  watchedCompletely: "all" | "true" | "false";
  certificateIssued: "all" | "true" | "false";
};

const ALL_STUDENTS_ITEM = { id: "", label: "All students" };
const ALL_COURSES_ITEM = { id: "", label: "All courses" };

const InstructorEnrollments = ({
  enrollments,
  pagination,
  studentFilter,
  courseFilter,
  watchedCompletely,
  certificateIssued,
}: InstructorEnrollmentsProps) => {
  const router = useRouter();

  const updateQuery = (next: {
    page?: number;
    student?: string;
    studentSearch?: string;
    studentPage?: number;
    course?: string;
    courseSearch?: string;
    coursePage?: number;
    watchedCompletely?: "all" | "true" | "false";
    certificateIssued?: "all" | "true" | "false";
  }) => {
    const nextStudent = next.student ?? studentFilter.student;
    const nextStudentSearch =
      next.studentSearch ?? studentFilter.studentSearch;
    const nextStudentPage =
      next.studentPage ?? studentFilter.studentsPagination.page ?? 1;
    const nextPage = next.page ?? pagination.page ?? 1;
    const nextCourse = next.course ?? courseFilter.course;
    const nextCourseSearch = next.courseSearch ?? courseFilter.courseSearch;
    const nextCoursePage =
      next.coursePage ?? courseFilter.coursesPagination.page ?? 1;
    const nextWatchedCompletely =
      next.watchedCompletely ?? watchedCompletely;
    const nextCertificateIssued =
      next.certificateIssued ?? certificateIssued;

    const searchParams = new URLSearchParams();
    if (nextStudent) searchParams.set("student", nextStudent);
    if (nextStudentSearch) {
      searchParams.set("studentSearch", nextStudentSearch);
    }
    if (nextStudentPage > 1) {
      searchParams.set("studentPage", String(nextStudentPage));
    }
    if (nextCourse) searchParams.set("course", nextCourse);
    if (nextCourseSearch) {
      searchParams.set("courseSearch", nextCourseSearch);
    }
    if (nextCoursePage > 1) {
      searchParams.set("coursePage", String(nextCoursePage));
    }
    if (nextWatchedCompletely !== "all") {
      searchParams.set("watchedCompletely", nextWatchedCompletely);
    }
    if (nextCertificateIssued !== "all") {
      searchParams.set("certificateIssued", nextCertificateIssued);
    }
    if (nextPage > 1) searchParams.set("page", String(nextPage));

    const query = searchParams.toString();
    router.push(`/instructor/enrollments${query ? `?${query}` : ""}`);
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Course Enrollments"
        pageDescription="View students enrolled in your courses."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-[220px]">
          <PagedSearchSelect
            items={[
              ALL_STUDENTS_ITEM,
              ...studentFilter.students.map((studentOption) => ({
                id: studentOption._id,
                label: studentOption.fullName,
              })),
            ]}
            pagination={studentFilter.studentsPagination}
            search={studentFilter.studentSearch}
            value={studentFilter.student}
            onValueChange={(value) => updateQuery({ student: value, page: 1 })}
            onSearchChange={(value) =>
              updateQuery({ studentSearch: value, studentPage: 1 })
            }
            onPageChange={(value) => updateQuery({ studentPage: value })}
            selectedLabel={
              studentFilter.student
                ? studentFilter.selectedStudentLabel
                : "All students"
            }
            placeholder="Filter by student"
            searchPlaceholder="Search students..."
          />
        </div>
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
