"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageFlexCol from "@/components/PageFlexCol";
import AppSearchBar from "@/components/AppSearchBar";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

import { CourseLevel } from "@/types/courseTypes";

// -------------------- Dummy Courses --------------------

const courses = [
  {
    _id: "1",
    title: "Full Stack MERN Development",
    description: "Learn MERN stack from beginner to advanced.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 49,
    level: CourseLevel.Beginner,
    instructor: "John Doe",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.7,
    totalReviews: 120,
    totalStudentsEnrolled: 2400,
    totalDurationInMinutes: 600,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Advanced React Patterns",
    description: "Master scalable React architecture and patterns.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 79,
    level: CourseLevel.Advanced,
    instructor: "Sarah Smith",
    category: "Frontend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.9,
    totalReviews: 90,
    totalStudentsEnrolled: 1300,
    totalDurationInMinutes: 520,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Node.js Backend APIs",
    description: "Build scalable backend APIs using Express.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 35,
    level: CourseLevel.Intermediate,
    instructor: "Ali Khan",
    category: "Backend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.5,
    totalReviews: 60,
    totalStudentsEnrolled: 900,
    totalDurationInMinutes: 430,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// -------------------- Sidebar --------------------

type FilterSidebarProps = {
  selectedLevels: CourseLevel[];
  onLevelToggle: (level: CourseLevel) => void;
  maxPrice: number[];
  onPriceChange: (val: number[]) => void;
  onReset: () => void;
};

const FilterSidebar = ({
  selectedLevels,
  onLevelToggle,
  maxPrice,
  onPriceChange,
  onReset,
}: FilterSidebarProps) => (
  <aside className="rounded-xl border bg-card p-5 h-fit space-y-5 sticky top-4">
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

    {/* Price */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Max Price</h3>
        <span className="text-sm font-semibold text-primary">
          ${maxPrice[0]}
        </span>
      </div>
      <Slider
        min={0}
        max={100}
        step={5}
        value={maxPrice}
        onValueChange={onPriceChange}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>$0</span>
        <span>$100</span>
      </div>
    </div>

    <Separator />

    {/* Level */}
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Course Level</h3>
      <div className="space-y-2.5">
        {Object.values(CourseLevel).map((level) => (
          <div key={level} className="flex items-center gap-2">
            <Checkbox
              id={`level-${level}`}
              checked={selectedLevels.includes(level)}
              onCheckedChange={() => onLevelToggle(level)}
            />
            <Label
              htmlFor={`level-${level}`}
              className="capitalize text-sm cursor-pointer font-normal"
            >
              {level}
            </Label>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

// -------------------- Page --------------------

const Courses = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<CourseLevel[]>([]);
  const [maxPrice, setMaxPrice] = useState([100]);

  const handleLevelToggle = (level: CourseLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  const handleReset = () => {
    setSelectedLevels([]);
    setMaxPrice([100]);
    setSearch("");
  };

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);
      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level);
      const matchesPrice = course.price <= maxPrice[0];
      return matchesSearch && matchesLevel && matchesPrice;
    });
  }, [search, selectedLevels, maxPrice]);

  return (
    <div className="p-10">
      <PageFlexCol>
        {/* Search */}
        <AppSearchBar
          placeholder="Search by title, category or instructor..."
          onChange={(value) => setSearch(value)}
        />

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Sidebar */}
          <FilterSidebar
            selectedLevels={selectedLevels}
            onLevelToggle={handleLevelToggle}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
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
                    `/student/browse-courses/course-details/${course._id}`,
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
  );
};

export default Courses;
