"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import type {
  StudentDashboardData,
  StudentActivityEvent,
  ActivityEventType,
} from "@/response-types/dashboardResponseTypes";

interface StudentDashboardProps {
  data: StudentDashboardData;
  period?: "week" | "month" | "year";
}

const StudentDashboard = ({ data, period }: StudentDashboardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPeriod = period ?? data.period ?? "month";
  const [selectedPeriod, setSelectedPeriod] = useOptimistic(currentPeriod);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (nextPeriod: "week" | "month" | "year") => {
    startTransition(() => {
      setSelectedPeriod(nextPeriod);
      router.push(`${pathname}?period=${nextPeriod}`, { scroll: false });
    });
  };

  const summary = data.summary;

  const periodLabel =
    currentPeriod === "week"
      ? "this week"
      : currentPeriod === "month"
        ? "this month"
        : "this year";

  const studentStats = [
    {
      title: "Enrolled Courses",
      value: summary.totalEnrolledCourses.toString(),
      icon: BookOpen,
      description: `${summary.activeCourses} active, ${summary.completedCourses} completed`,
      iconColor: "text-blue-500",
    },
    {
      title: "Completed Courses",
      value: summary.completedCourses.toString(),
      icon: CheckCircle,
      description: `${
        summary.totalEnrolledCourses > 0
          ? Math.round(
              (summary.completedCourses / summary.totalEnrolledCourses) * 100
            )
          : 0
      }% completion rate`,
      iconColor: "text-green-500",
    },
    {
      title: "Overall Progress",
      value: `${summary.overallProgressPercent.toFixed(1)}%`,
      icon: TrendingUp,
      description: "Across active courses",
      iconColor: "text-purple-500",
    },
    {
      title: "Total Watch Time",
      value: `${Math.floor(summary.totalWatchTimeInMinutes / 60)}h ${
        summary.totalWatchTimeInMinutes % 60
      }m`,
      icon: Clock,
      description: `${summary.totalWatchTimeInMinutes.toLocaleString()} minutes total (${periodLabel})`,
      iconColor: "text-orange-500",
    },
  ];

  const activityColumns = [
    {
      key: "type",
      label: "Activity",
      render: (val: ActivityEventType) => {
        const label =
          val === "certificate_earned"
            ? "Certificate Earned"
            : val === "completed"
              ? "Course Completed"
              : "Enrolled in Course";

        return (
          <Badge
            variant={
              val === "certificate_earned"
                ? "default"
                : val === "completed"
                  ? "secondary"
                  : "outline"
            }
            className={
              val === "certificate_earned"
                ? "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20"
                : val === "completed"
                  ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20"
                  : "text-blue-600 border-blue-200 bg-blue-500/10"
            }
          >
            {label}
          </Badge>
        );
      },
    },
    {
      key: "courseTitle",
      label: "Course",
      render: (val: string, row: StudentActivityEvent) => (
        <Link
          href={`/course-details/${row.courseId}?role=student&source=enrolled`}
          className="font-medium hover:text-primary transition-colors"
        >
          {val}
        </Link>
      ),
    },
    {
      key: "occurredAt",
      label: "Time",
      render: (val: string) => (
        <span className="text-muted-foreground text-xs">
          {new Date(val).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <PageFlexCol>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning progress, resume courses, and view achievements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Select
            value={selectedPeriod}
            onValueChange={(val) =>
              handlePeriodChange(val as "week" | "month" | "year")
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60 pointer-events-none" : "opacity-100"
        } flex flex-col gap-6`}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {studentStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Continue Watching
              </h2>
              <p className="text-sm text-muted-foreground">
                Jump back into your recently watched courses.
              </p>
            </div>
            <Link href="/student/my-learning/enrolled-courses">
              <AppButton variant="ghost" className="text-primary">
                View All Courses
              </AppButton>
            </Link>
          </div>

          {data.continueWatching.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground flex flex-col items-center justify-center">
              <PlayCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-foreground text-lg">
                No courses in progress
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                You don&apos;t have any active courses right now. Explore the
                catalog to start learning!
              </p>
              <Link href="/courses" className="mt-5">
                <AppButton>Browse Courses</AppButton>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.continueWatching.map((item) => (
                <CourseCard
                  key={item.enrollmentId}
                  course={{
                    _id: item.courseId,
                    title: item.courseTitle,
                    thumbnailUrl: item.courseThumbnailUrl ?? undefined,
                    price: 0,
                    level: item.courseLevel,
                    instructor: item.instructorName,
                    category: "Enrolled",
                    averageRating: 0,
                    totalReviews: 0,
                    totalStudentsEnrolled: 0,
                    totalDurationInMinutes: item.totalDurationInMinutes,
                    totalDurationWatchedInMinutes:
                      item.totalDurationWatchedInMinutes,
                    watchedCompletely: false,
                  }}
                  mode="in-progress"
                  footer={
                    <Link
                      href={`/course-details/${item.courseId}?role=student&source=enrolled`}
                    >
                      <AppButton className="w-full mt-2" leftIcon={PlayCircle}>
                        Resume Course
                      </AppButton>
                    </Link>
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">
              A timeline of your 5 most recent enrollments, completions, and earned certificates.
            </p>
          </div>
          <AppTable columns={activityColumns} data={data.recentActivity} />
        </div>
      </div>
    </PageFlexCol>
  );
};

export default StudentDashboard;

