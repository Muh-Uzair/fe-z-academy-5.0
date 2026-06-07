"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CourseLevel } from "@/types/courseTypes";

// -------------------- Constants --------------------

const CATEGORIES = [
  "Web Development",
  "Frontend",
  "Backend",
  "Design",
  "Data Science",
  "DevOps",
  "Cloud",
];

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

import { coursesData as courses } from "@/dummy-data";
// -------------------- Sidebar --------------------

type FilterSidebarProps = {
  maxPrice: number[];
  onPriceChange: (val: number[]) => void;
  minRating: number | null;
  onRatingChange: (val: number | null) => void;
  selectedDuration: string | null;
  onDurationChange: (val: string | null) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (val: boolean) => void;
  onReset: () => void;
};

const FilterSidebar = ({
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedDuration,
  onDurationChange,
  verifiedOnly,
  onVerifiedChange,
  onReset,
}: FilterSidebarProps) => (
  <aside className="rounded-xl border bg-card p-4 sm:p-5 h-fit space-y-5 static lg:sticky lg:top-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-base">Filters</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground text-xs h-7 px-2"
      >
        Reset all
      </Button>
    </div>

    <Separator />

    {/* Verified only */}
    <div className="flex items-center justify-between">
      <Label
        htmlFor="verified-toggle"
        className="text-sm font-medium cursor-pointer"
      >
        Verified only
      </Label>
      <Switch
        id="verified-toggle"
        checked={verifiedOnly}
        onCheckedChange={onVerifiedChange}
      />
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

const Courses = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState([1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleReset = () => {
    setSelectedLevel("all");
    setMaxPrice([1000]);
    setSelectedCategory("all");
    setMinRating(null);
    setSelectedDuration(null);
    setVerifiedOnly(false);
    setSearch("");
  };

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase();

    const durationRange = DURATION_OPTIONS.find(
      (d) => d.label === selectedDuration,
    );

    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(q) ||
        course.categoryName.toLowerCase().includes(q) ||
        course.instructorName.toLowerCase().includes(q);

      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;

      const matchesPrice = course.price <= maxPrice[0];

      const matchesCategory =
        selectedCategory === "all" || course.categoryName === selectedCategory;

      const matchesRating =
        minRating === null || course.averageRating >= minRating;

      const matchesDuration =
        !durationRange ||
        (course.totalDurationInMinutes >= durationRange.min &&
          course.totalDurationInMinutes < durationRange.max);

      const matchesVerified = !verifiedOnly || course.isVerified;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesPrice &&
        matchesCategory &&
        matchesRating &&
        matchesDuration &&
        matchesVerified
      );
    });
  }, [
    search,
    selectedLevel,
    maxPrice,
    selectedCategory,
    minRating,
    selectedDuration,
    verifiedOnly,
  ]);

  return (
    <>
      <PublicNavbar />
      <div className="p-4 sm:p-6 md:p-10">
      <PageFlexCol>
        {/* Top Bar: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <AppSearchBar
            placeholder="Search by title, category or instructor..."
            onChange={(value) => setSearch(value)}
            className="w-full flex-1"
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-card">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-[180px] bg-card capitalize">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {Object.values(CourseLevel).map((level) => (
                  <SelectItem key={level} value={level} className="capitalize">
                    {level}
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
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            minRating={minRating}
            onRatingChange={setMinRating}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            verifiedOnly={verifiedOnly}
            onVerifiedChange={setVerifiedOnly}
            onReset={handleReset}
          />

          {/* Courses grid */}
          <AppCourseCardsGridLayout
            courses={filteredCourses}
            pagination={true}
            renderFooter={(course) => (
              <Button
                className="w-full"
                onClick={() =>
                  router.push(
                    `/course-details/${course._id}?role=student`,
                  )
                }
              >
                View Details
              </Button>
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
