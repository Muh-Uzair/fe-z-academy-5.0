"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Users,
  BookOpen,
  Star,
  Wallet,
  PieChart as PieChartIcon,
  Loader2,
} from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type {
  InstructorDashboardData,
  InstructorCoursePerformance,
  InstructorRecentReview,
} from "@/response-types/dashboardResponseTypes";

// Palette derived strictly from the primary tokens in globals.css
const PRIMARY_SHADES = [
  "var(--primary)",
  "var(--primary-dark)",
  "var(--primary-light)",
  "var(--primary-very-dark)",
  "oklch(0.6 0.11 175)",
  "oklch(0.78 0.12 174)",
  "oklch(0.44 0.08 168)",
  "var(--primary-very-light)",
];

const ENROLLMENTS_CONFIG = {
  enrollments: {
    label: "Enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatPercentTrend(
  changePercent: number | null,
  period: "week" | "month" | "year"
): { trend: "up" | "down" | "neutral"; trendValue: string } {
  if (changePercent === null) {
    return { trend: "neutral", trendValue: `0% vs last ${period}` };
  }
  const rounded = Math.round(Math.abs(changePercent) * 10) / 10;
  if (changePercent > 0) {
    return { trend: "up", trendValue: `${rounded}% from last ${period}` };
  }
  if (changePercent < 0) {
    return { trend: "down", trendValue: `${rounded}% from last ${period}` };
  }
  return { trend: "neutral", trendValue: `0% vs last ${period}` };
}

function formatBucketLabel(
  label: string,
  period: "week" | "month" | "year"
): string {
  if (!label) return "";
  try {
    if (period === "week") {
      const date = new Date(label + "T00:00:00");
      if (isNaN(date.getTime())) return label;
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (period === "month") {
      const parts = label.split("-");
      return parts[1] ? `W${parts[1]}` : label;
    }
    if (period === "year") {
      const [year, month] = label.split("-");
      const date = new Date(Number(year), Number(month) - 1, 1);
      if (isNaN(date.getTime())) return label;
      return date.toLocaleDateString("en-US", { month: "short" });
    }
  } catch {
    return label;
  }
  return label;
}

interface InstructorDashboardProps {
  data: InstructorDashboardData;
  period?: "week" | "month" | "year";
}

const InstructorDashboard = ({ data, period }: InstructorDashboardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPeriod = period ?? data.period;
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedPeriod(currentPeriod);
  }, [currentPeriod]);

  const handlePeriodChange = (nextPeriod: "week" | "month" | "year") => {
    setSelectedPeriod(nextPeriod);
    startTransition(() => {
      router.push(`${pathname}?period=${nextPeriod}`, { scroll: false });
    });
  };

  const summary = data.summary;
  const revTrend = formatPercentTrend(
    summary.totalRevenue.changePercent,
    currentPeriod
  );
  const commTrend = formatPercentTrend(
    summary.totalAdminCommission.changePercent,
    currentPeriod
  );
  const studTrend = formatPercentTrend(
    summary.totalStudents.changePercent,
    currentPeriod
  );

  const instructorStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue.current),
      icon: DollarSign,
      trend: revTrend.trend,
      trendValue: revTrend.trendValue,
      iconColor: "text-green-500",
    },
    {
      title: "Admin Commission",
      value: formatCurrency(summary.totalAdminCommission.current),
      icon: Wallet,
      trend: commTrend.trend,
      trendValue: commTrend.trendValue,
      iconColor: "text-blue-500",
    },
    {
      title: "Total Students",
      value: summary.totalStudents.current.toLocaleString(),
      icon: Users,
      trend: studTrend.trend,
      trendValue: studTrend.trendValue,
      iconColor: "text-purple-500",
    },
    {
      title: "Total Courses",
      value: (
        summary.totalCourses.live + summary.totalCourses.pending
      ).toString(),
      icon: BookOpen,
      description: `${summary.totalCourses.live} Live, ${summary.totalCourses.pending} Pending Verification`,
      iconColor: "text-indigo-500",
    },
    {
      title: "Average Rating",
      value:
        summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "0.0",
      icon: Star,
      description: "Across all verified courses",
      iconColor: "text-yellow-500",
    },
  ];

  // Donut chart config and data
  const earningsConfig: ChartConfig = {};
  const pieData = data.revenueByCourseTrend.map((slice, index) => {
    const key = `course_${index}`;
    const color = PRIMARY_SHADES[index % PRIMARY_SHADES.length];
    earningsConfig[key] = {
      label: slice.courseTitle,
      color,
    };
    return {
      key,
      name: slice.courseTitle,
      value: slice.instructorRevenue / 100,
      color,
    };
  });

  // Enrollment trend data
  const chartEnrollmentsData = data.enrollmentTrend.map((pt) => ({
    label: formatBucketLabel(pt.label, currentPeriod),
    rawLabel: pt.label,
    enrollments: pt.newEnrollments,
  }));

  const courseColumns = [
    {
      key: "title",
      label: "Course Title",
      render: (val: string, row: InstructorCoursePerformance) => (
        <div>
          <div className="font-medium">{val}</div>
          <Badge
            variant={row.isVerified ? "default" : "outline"}
            className={
              row.isVerified
                ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 mt-1"
                : "text-amber-600 border-amber-200 bg-amber-500/10 mt-1"
            }
          >
            {row.isVerified ? "Live" : "Pending Verification"}
          </Badge>
        </div>
      ),
    },
    {
      key: "totalStudentsEnrolled",
      label: "Enrollments",
      render: (val: number) => <span>{val?.toLocaleString() ?? 0}</span>,
    },
    {
      key: "averageRating",
      label: "Rating",
      render: (val: number) =>
        val > 0 ? (
          <span className="text-yellow-500 font-medium">
            ★ {val.toFixed(1)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "avgCompletionPercent",
      label: "Avg. Completion",
      render: (val: number) => {
        const percent = Math.min(Math.max(val ?? 0, 0), 100);
        return (
          <div className="w-[100px]">
            <div className="text-xs text-muted-foreground mb-1">
              {percent.toFixed(1)}%
            </div>
            <Progress value={percent} className="h-1.5" />
          </div>
        );
      },
    },
    {
      key: "totalRevenueInstructor",
      label: "Revenue",
      render: (val: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(val ?? 0)}
        </span>
      ),
    },
  ];

  const reviewColumns = [
    { key: "courseTitle", label: "Course" },
    { key: "studentName", label: "Student" },
    {
      key: "rating",
      label: "Rating",
      render: (val: number) => (
        <span className="text-yellow-500 font-medium">
          {"★".repeat(Math.max(0, Math.min(val, 5)))}
          {"☆".repeat(Math.max(0, 5 - Math.min(val, 5)))}
        </span>
      ),
    },
    {
      key: "feedback",
      label: "Review",
      render: (val: string) => (
        <span className="text-muted-foreground italic line-clamp-1 max-w-[300px]">
          "{val}"
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val: string) => (
        <span className="text-muted-foreground">
          {new Date(val).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  const periodSubtitle =
    currentPeriod === "week"
      ? "Daily breakdown over the last 7 days"
      : currentPeriod === "month"
        ? "Weekly breakdown over the last 30 days"
        : "Monthly breakdown over the last 12 months";

  return (
    <PageFlexCol>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your course performance, enrollments, and earnings.
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {instructorStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Revenue by Course</h3>
              <p className="text-sm text-muted-foreground">
                Revenue breakdown across your courses for this period
              </p>
            </div>
            {pieData.length === 0 ? (
              <div className="h-[260px] flex flex-col items-center justify-center text-center text-muted-foreground text-sm">
                <PieChartIcon className="h-10 w-10 stroke-1 mb-2 opacity-40" />
                <p>No course revenue recorded for this period.</p>
              </div>
            ) : (
              <ChartContainer
                config={earningsConfig}
                className="h-[260px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="text-muted-foreground">{name}:</span>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(Number(value) * 100)}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Enrollments Trend</h3>
              <p className="text-sm text-muted-foreground">{periodSubtitle}</p>
            </div>
            <ChartContainer
              config={ENROLLMENTS_CONFIG}
              className="h-[260px] w-full"
            >
              <LineChart
                data={chartEnrollmentsData}
                margin={{ top: 10, left: -20, right: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => (
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span className="text-muted-foreground">
                            New Enrollments:
                          </span>
                          <span className="font-semibold text-foreground">
                            {Number(value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="var(--color-enrollments)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-enrollments)" }}
                  activeDot={{ r: 6, fill: "var(--color-enrollments)" }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Course Performance
            </h2>
            <p className="text-sm text-muted-foreground">
              Top 5 courses ranked by student enrollments and completion rates.
            </p>
          </div>
          <AppTable columns={courseColumns} data={data.coursePerformance} />
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Reviews</h2>
            <p className="text-sm text-muted-foreground">
              5 most recent reviews and ratings submitted by your enrolled students.
            </p>
          </div>
          <AppTable columns={reviewColumns} data={data.recentReviews} />
        </div>
      </div>
    </PageFlexCol>
  );
};

export default InstructorDashboard;

