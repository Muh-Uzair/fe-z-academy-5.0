"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";

import AppButton from "@/components/AppButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import PagedSearchSelect, {
  type PagedSearchSelectItem,
} from "@/components/PagedSearchSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// -------------------- Constants --------------------

const RATING_OPTIONS = [
  { label: "4.5 & up", value: 4.5 },
  { label: "4.0 & up", value: 4.0 },
  { label: "3.5 & up", value: 3.5 },
  { label: "3.0 & up", value: 3.0 },
];

const DURATION_OPTIONS = [
  { label: "Under 2 hours", min: 0, max: 120 },
  { label: "2 – 5 hours", min: 120, max: 300 },
  { label: "5 – 10 hours", min: 300, max: 600 },
  { label: "10+ hours", min: 600, max: Infinity },
];

import type {
  PublicCourseListItem,
  CourseLevel,
} from "@/response-types/courseResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";

const COURSE_LEVELS: CourseLevel[] = ["beginner", "intermediate", "advanced"];

// -------------------- Sidebar --------------------

type FilterSidebarProps = {
  maxPrice: number[];
  onPriceChange: (val: number[]) => void;
  minRating: number | null;
  onRatingChange: (val: number | null) => void;
  selectedDuration: string | null;
  onDurationChange: (val: string | null) => void;
  onReset: () => void;
};

const FilterSidebar = ({
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedDuration,
  onDurationChange,
  onReset,
}: FilterSidebarProps) => (
  <aside className="rounded-xl border bg-card p-4 sm:p-5 h-fit space-y-5 static lg:sticky lg:top-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-base">Filters</h2>
      <AppButton
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground text-xs h-7 px-2"
      >
        Reset all
      </AppButton>
    </div>

    <Separator />

    {/* Price */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Max Price</h3>
        <span className="text-sm font-semibold text-primary">
          ${maxPrice[0]}
        </span>
      </div>
      <Slider
        min={1}
        max={1000}
        step={10}
        value={maxPrice}
        onValueChange={onPriceChange}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>$1</span>
        <span>$1000</span>
      </div>
    </div>

    <Separator />

    {/* Rating */}
    <div className="space-y-2.5">
      <h3 className="text-sm font-medium">Min Rating</h3>
      {RATING_OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2">
          <Checkbox
            id={`rating-${opt.value}`}
            checked={minRating === opt.value}
            onCheckedChange={() =>
              onRatingChange(minRating === opt.value ? null : opt.value)
            }
          />
          <Label
            htmlFor={`rating-${opt.value}`}
            className="text-sm font-normal cursor-pointer flex items-center gap-1"
          >
            <span className="text-yellow-400">★</span> {opt.label}
          </Label>
        </div>
      ))}
    </div>

    <Separator />

    {/* Duration */}
    <div className="space-y-2.5">
      <h3 className="text-sm font-medium">Duration</h3>
      {DURATION_OPTIONS.map((opt) => (
        <div key={opt.label} className="flex items-center gap-2">
          <Checkbox
            id={`duration-${opt.label}`}
            checked={selectedDuration === opt.label}
            onCheckedChange={() =>
              onDurationChange(
                selectedDuration === opt.label ? null : opt.label,
              )
            }
          />
          <Label
            htmlFor={`duration-${opt.label}`}
            className="text-sm font-normal cursor-pointer"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </div>
  </aside>
);

// -------------------- Page --------------------

type CoursesProps = {
  courses: PublicCourseListItem[];
  pagination: Pagination;
  initialSearch: string;
  category: string;
  level: string;
  maxPrice: number;
  minRating: number | null;
  duration: string | null;
  categoryItems: PagedSearchSelectItem[];
  categoryPagination: Pagination;
  categorySearch: string;
  instructor: string;
  instructorItems: PagedSearchSelectItem[];
  instructorPagination: Pagination;
  instructorSearch: string;
};

const Courses = ({
  courses,
  pagination,
  initialSearch,
  category,
  level,
  maxPrice,
  minRating,
  duration,
  categoryItems,
  categoryPagination,
  categorySearch,
  instructor,
  instructorItems,
  instructorPagination,
  instructorSearch,
}: CoursesProps) => {
  const router = useRouter();

  const updateQuery = (next: {
    search?: string;
    page?: number;
    category?: string;
    categorySearch?: string;
    categoryPage?: number;
    instructor?: string;
    instructorSearch?: string;
    instructorPage?: number;
    level?: string;
    maxPrice?: number;
    minRating?: number | null;
    duration?: string | null;
  }) => {
    const nextSearch = next.search ?? initialSearch;
    const nextPage = next.page ?? pagination.page ?? 1;
    const nextCategory = next.category ?? category;
    const nextCategorySearch = next.categorySearch ?? categorySearch;
    const nextCategoryPage = next.categoryPage ?? categoryPagination.page ?? 1;
    const nextInstructor = next.instructor ?? instructor;
    const nextInstructorSearch = next.instructorSearch ?? instructorSearch;
    const nextInstructorPage =
      next.instructorPage ?? instructorPagination.page ?? 1;
    const nextLevel = next.level ?? level;
    const nextMaxPrice = next.maxPrice ?? maxPrice;
    const nextMinRating =
      next.minRating !== undefined ? next.minRating : minRating;
    const nextDuration = next.duration !== undefined ? next.duration : duration;

    const searchParams = new URLSearchParams();
    if (nextSearch) searchParams.set("search", nextSearch);
    if (nextCategory && nextCategory !== "all")
      searchParams.set("category", nextCategory);
    if (nextCategorySearch)
      searchParams.set("categorySearch", nextCategorySearch);
    if (nextCategoryPage > 1)
      searchParams.set("categoryPage", String(nextCategoryPage));
    if (nextInstructor && nextInstructor !== "all")
      searchParams.set("instructor", nextInstructor);
    if (nextInstructorSearch)
      searchParams.set("instructorSearch", nextInstructorSearch);
    if (nextInstructorPage > 1)
      searchParams.set("instructorPage", String(nextInstructorPage));
    if (nextLevel && nextLevel !== "all") searchParams.set("level", nextLevel);
    if (nextPage > 1) searchParams.set("page", String(nextPage));
    if (nextMaxPrice < 1000) searchParams.set("maxPrice", String(nextMaxPrice));
    if (nextMinRating !== null)
      searchParams.set("minRating", String(nextMinRating));
    if (nextDuration) searchParams.set("duration", nextDuration);

    const query = searchParams.toString();
    router.push(`/courses${query ? `?${query}` : ""}`);
  };

  const handleReset = () => {
    updateQuery({
      search: "",
      page: 1,
      category: "all",
      categorySearch: "",
      categoryPage: 1,
      instructor: "all",
      instructorSearch: "",
      instructorPage: 1,
      level: "all",
      maxPrice: 1000,
      minRating: null,
      duration: null,
    });
  };

  return (
    <>
      <PublicNavbar />
      <div className="p-4 sm:p-6 md:p-10">
        <PageFlexCol>
          {/* Top Bar: Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <AppSearchBar
              placeholder="Search by title, category or instructor..."
              defaultValue={initialSearch}
              onChange={(value) => updateQuery({ search: value, page: 1 })}
              className="w-full flex-1"
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
              <div className="w-full md:w-[220px]">
                <PagedSearchSelect
                  items={[
                    { id: "all", label: "All Categories" },
                    ...categoryItems,
                  ]}
                  pagination={categoryPagination}
                  search={categorySearch}
                  value={category}
                  onValueChange={(val) =>
                    updateQuery({ category: val, page: 1 })
                  }
                  onSearchChange={(val) =>
                    updateQuery({ categorySearch: val, categoryPage: 1 })
                  }
                  onPageChange={(p) => updateQuery({ categoryPage: p })}
                  placeholder="All Categories"
                  emptyMessage="No categories found."
                />
              </div>

              <div className="w-full md:w-[220px]">
                <PagedSearchSelect
                  items={[
                    { id: "all", label: "All Instructors" },
                    ...instructorItems,
                  ]}
                  pagination={instructorPagination}
                  search={instructorSearch}
                  value={instructor}
                  onValueChange={(val) =>
                    updateQuery({ instructor: val, page: 1 })
                  }
                  onSearchChange={(val) =>
                    updateQuery({ instructorSearch: val, instructorPage: 1 })
                  }
                  onPageChange={(p) => updateQuery({ instructorPage: p })}
                  placeholder="All Instructors"
                  emptyMessage="No instructors found."
                />
              </div>

              <Select
                value={level}
                onValueChange={(val) => updateQuery({ level: val, page: 1 })}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-card capitalize">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {COURSE_LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl} className="capitalize">
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
            {/* Sidebar */}
            <FilterSidebar
              maxPrice={[maxPrice]}
              onPriceChange={(val) =>
                updateQuery({ maxPrice: val[0], page: 1 })
              }
              minRating={minRating}
              onRatingChange={(val) => updateQuery({ minRating: val, page: 1 })}
              selectedDuration={duration}
              onDurationChange={(val) =>
                updateQuery({ duration: val, page: 1 })
              }
              onReset={handleReset}
            />

            {/* Courses grid */}
            <AppCourseCardsGridLayout
              courses={courses as any}
              pagination={true}
              paginationMeta={pagination}
              onPageChange={(p) => updateQuery({ page: p })}
              renderFooter={(course) => (
                <AppButton
                  className="w-full"
                  onClick={() =>
                    router.push(`/course-details/${course._id}?source=browse`)
                  }
                >
                  View Details
                </AppButton>
              )}
            />
          </div>
        </PageFlexCol>
      </div>
      <PublicFooter />
    </>
  );
};

export default Courses;
