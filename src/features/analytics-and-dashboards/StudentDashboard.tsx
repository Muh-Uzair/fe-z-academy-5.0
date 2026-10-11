"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Clock,
  PlayCircle,
  Star,
} from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import AppButton from "@/components/AppButton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type {
  StudentDashboardData,
  StudentContinueWatchingItem,
  StudentRecentTransaction,
  StudentRecentReview,
} from "@/response-types/dashboardResponseTypes";

interface StudentDashboardProps {
  data: StudentDashboardData;
}

const StudentDashboard = ({ data }: StudentDashboardProps) => {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatWatchTime = (totalMinutes: number) => {
    if (!totalMinutes || totalMinutes <= 0) return "0 mins";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} mins`;
    if (minutes === 0) return `${hours} hrs`;
    return `${hours}h ${minutes}m`;
  };

  const stats = data?.stats ?? {
    enrolledCourses: 0,
    completedCourses: 0,
    averageCompletionPercentage: 0,
    totalWatchTime: 0,
  };

  const continueWatching = data?.continueWatching ?? [];
  const recentTransactions = data?.recentTransactions ?? [];
  const recentReviews = data?.recentReviews ?? [];

  return (
    <PageFlexCol>
      {/* ─── 1. Header ──────────────────────────────────────────────────────── */}
      <PageHeader
        pageHeading="Student Dashboard"
        pageDescription="Track your learning progress, resume watching courses, and view your activity."
      />

      {/* ─── 2. Key Metrics Stat Cards (4 Across) ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Completed Courses"
          value={stats.completedCourses}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Avg. Completion"
          value={`${(stats.averageCompletionPercentage ?? 0).toFixed(1)}%`}
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Total Watch Time"
          value={formatWatchTime(stats.totalWatchTime)}
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
      </div>

      {/* ─── 3. Continue Watching Section ───────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Continue Watching
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick up right where you left off across your enrolled courses.
          </p>
        </div>

        {continueWatching.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueWatching.map((item: StudentContinueWatchingItem) => (
              <div
                key={item.enrollmentId || item.courseId}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="relative w-full overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-muted-foreground">
                          <PlayCircle className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </AspectRatio>
                    {item.mostRecentlySeen && (
                      <span className="absolute left-3 top-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-sm">
                        Recently Watched
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Instructor: {item.instructorName}
                    </p>

                    <div className="mt-2 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-medium">
                          Progress
                        </span>
                        <span className="font-semibold text-primary">
                          {item.watchPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              Math.max(item.watchPercentage, 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground text-right">
                        {item.totalDurationWatchedInMinutes} /{" "}
                        {item.totalDurationInMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <AppButton
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/course-details/${item.courseId}?role=student&source=enrolled`,
                      )
                    }
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Resume Course
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-muted-foreground/60" />
            <div>
              <h3 className="font-semibold text-foreground">
                No courses in progress
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Start learning by exploring available courses or continuing an
                enrolled course.
              </p>
            </div>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => router.push("/student/browse-courses")}
            >
              Browse Courses
            </AppButton>
          </div>
        )}
      </div>

      {/* ─── 4. Recent Transactions Table ───────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Recent Transactions
          </h2>
          <p className="text-sm text-muted-foreground">
            Your 5 most recent course purchases and payment records.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "courseTitle",
              label: "Course",
              render: (_: unknown, row: StudentRecentTransaction) => (
                <span className="font-medium text-foreground">
                  {row.courseTitle}
                </span>
              ),
            },
            {
              key: "instructorName",
              label: "Instructor",
              render: (_: unknown, row: StudentRecentTransaction) => (
                <span className="text-muted-foreground">
                  {row.instructorName}
                </span>
              ),
            },
            {
              key: "amountPaid",
              label: "Amount",
              render: (value: number) => (
                <span className="font-semibold text-emerald-600">
                  ${value ?? 0}
                </span>
              ),
            },
            {
              key: "paymentStatus",
              label: "Status",
              render: (value: string) => {
                if (value === "paid") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                      Paid
                    </span>
                  );
                }
                if (value === "refunded") {
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                      Refunded
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 capitalize">
                    {value}
                  </span>
                );
              },
            },
            {
              key: "createdAt",
              label: "Date",
              render: (value: string) => (
                <span className="text-muted-foreground">
                  {formatDate(value)}
                </span>
              ),
            },
          ]}
          data={recentTransactions}
        />
      </div>

      {/* ─── 5. Recent Reviews Table ────────────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            My Recent Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            Feedback and ratings you have submitted for your courses.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "courseTitle",
              label: "Course",
              render: (_: unknown, row: StudentRecentReview) => (
                <span className="font-medium text-foreground">
                  {row.courseTitle}
                </span>
              ),
            },
            {
              key: "instructorName",
              label: "Instructor",
              render: (_: unknown, row: StudentRecentReview) => (
                <span className="text-muted-foreground">
                  {row.instructorName}
                </span>
              ),
            },
            {
              key: "rating",
              label: "Rating",
              render: (value: number) => (
                <div className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{value ? value.toFixed(1) : "-"}</span>
                </div>
              ),
            },
            {
              key: "review",
              label: "Feedback",
              render: (_: unknown, row: StudentRecentReview) => (
                <span className="line-clamp-1 max-w-sm text-muted-foreground">
                  {row.review || row.feedback || "-"}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Date",
              render: (value: string) => (
                <span className="text-muted-foreground">
                  {formatDate(value)}
                </span>
              ),
            },
          ]}
          data={recentReviews}
        />
      </div>
    </PageFlexCol>
  );
};

export default StudentDashboard;
