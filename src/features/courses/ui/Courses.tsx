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

// -------------------- Dummy Courses (12) --------------------

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
  {
    _id: "4",
    title: "UI/UX Design Fundamentals",
    description:
      "Learn the principles of great design using Figma and design systems.",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 55,
    level: CourseLevel.Beginner,
    instructor: "Emily Chen",
    category: "Design",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 200,
    totalStudentsEnrolled: 3100,
    totalDurationInMinutes: 380,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Python for Data Science",
    description: "Analyse data and build ML models with Python and pandas.",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 89,
    level: CourseLevel.Intermediate,
    instructor: "Dr. Mia Torres",
    category: "Data Science",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.8,
    totalReviews: 340,
    totalStudentsEnrolled: 5200,
    totalDurationInMinutes: 720,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "DevOps & CI/CD Pipelines",
    description:
      "Ship faster with Docker, GitHub Actions and cloud deployment.",
    thumbnail:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 95,
    level: CourseLevel.Advanced,
    instructor: "Marcus Lee",
    category: "DevOps",
    isVerified: false,
    verificationRejectionReason: null,
    averageRating: 4.7,
    totalReviews: 75,
    totalStudentsEnrolled: 870,
    totalDurationInMinutes: 640,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "TypeScript from Zero to Hero",
    description: "Go from JavaScript to fully typed TypeScript with generics.",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 45,
    level: CourseLevel.Beginner,
    instructor: "Laura White",
    category: "Frontend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.4,
    totalReviews: 110,
    totalStudentsEnrolled: 1700,
    totalDurationInMinutes: 310,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "8",
    title: "GraphQL API Design",
    description: "Design and consume flexible GraphQL APIs with Apollo.",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 69,
    level: CourseLevel.Intermediate,
    instructor: "James Park",
    category: "Backend",
    isVerified: false,
    verificationRejectionReason: null,
    averageRating: 3.8,
    totalReviews: 48,
    totalStudentsEnrolled: 620,
    totalDurationInMinutes: 290,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "9",
    title: "AWS Cloud Practitioner",
    description:
      "Get certified and deploy resilient apps on Amazon Web Services.",
    thumbnail:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 99,
    level: CourseLevel.Advanced,
    instructor: "Nadia Rahman",
    category: "Cloud",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.9,
    totalReviews: 280,
    totalStudentsEnrolled: 4100,
    totalDurationInMinutes: 800,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "10",
    title: "HTML & CSS for Beginners",
    description: "Build your first website with semantic HTML and modern CSS.",
    thumbnail:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 0,
    level: CourseLevel.Beginner,
    instructor: "Tom Harris",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.2,
    totalReviews: 520,
    totalStudentsEnrolled: 8900,
    totalDurationInMinutes: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "11",
    title: "Microservices with Kubernetes",
    description: "Architect and orchestrate microservices at scale using K8s.",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 85,
    level: CourseLevel.Advanced,
    instructor: "Yuki Tanaka",
    category: "DevOps",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.6,
    totalReviews: 95,
    totalStudentsEnrolled: 1100,
    totalDurationInMinutes: 560,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "12",
    title: "SQL & PostgreSQL Mastery",
    description:
      "Write complex queries, design schemas and optimise databases.",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    videoUrl: "",
    price: 42,
    level: CourseLevel.Intermediate,
    instructor: "Priya Mehta",
    category: "Backend",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 3.5,
    totalReviews: 130,
    totalStudentsEnrolled: 2000,
    totalDurationInMinutes: 350,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
        course.category.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);

      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;

      const matchesPrice = course.price <= maxPrice[0];

      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;

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
