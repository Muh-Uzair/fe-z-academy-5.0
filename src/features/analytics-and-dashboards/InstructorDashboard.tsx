"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Wallet,
  Users,
  BookOpen,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  InstructorDashboardData,
  InstructorCoursePerformance,
  InstructorRecentReview,
  DashboardPeriod,
} from "@/response-types/dashboardResponseTypes";

interface InstructorDashboardProps {
  data: InstructorDashboardData;
  period: DashboardPeriod;
}

const DONUT_COLORS = [
  "#14b8a6",
  "#0d9488",
  "#059669",
  "#10b981",
  "#0284c7",
  "#6366f1",
];

const InstructorDashboard = ({ data, period }: InstructorDashboardProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateQuery = (next: { period?: DashboardPeriod }) => {
    const nextPeriod = next.period ?? period;
    const params = new URLSearchParams();
    if (nextPeriod !== "month") {
      params.set("period", nextPeriod);
    }
    const query = params.toString();
    router.push(`/instructor/dashboard${query ? `?${query}` : ""}`);
  };

  const periodBreakdownText = useMemo(() => {
    switch (period) {
      case "week":
        return "Daily breakdown over the last 7 days";
      case "year":
        return "Monthly breakdown over the last 365 days";
      case "month":
      default:
        return "Weekly breakdown over the last 30 days";
    }
  }, [period]);

  const enrollmentsChartData = useMemo(() => {
    return Object.entries(data?.enrollmentsTrend ?? {}).map(
      ([name, value]) => ({
        name,
        enrollments: value,
      }),
    );
  }, [data?.enrollmentsTrend]);

  const revenueByCourseData = useMemo(() => {
    const items = (data?.revenueByCourse ?? [])
      .filter((item) => item.revenue > 0)
      .map((item) => ({
        name: item.courseTitle || item.title,
        value: item.revenue,
        isEmpty: false,
      }));

    if (items.length === 0) {
      return [{ name: "No Revenue", value: 1, isEmpty: true }];
    }
    return items;
  }, [data?.revenueByCourse]);

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

  const stats = data?.stats ?? {
    totalRevenue: 0,
    adminCommission: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
  };

  return (
    <PageFlexCol>
      {/* ─── 1. Header with Period Selector ─────────────────────────────────── */}
      <PageHeader
        pageHeading="Instructor Dashboard"
        pageDescription="Monitor your course performance, enrollments, and earnings."
        pageHeaderRightSection={
          <Select
            value={period}
            onValueChange={(val: DashboardPeriod) =>
              updateQuery({ period: val })
            }
          >
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* ─── 2. Key Metrics Stat Cards (5 Across) ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Admin Commission"
          value={`$${stats.adminCommission.toLocaleString()}`}
          icon={Wallet}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />

        <StatCard
          title="Average Rating"
          value={
            stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"
          }
          icon={Star}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          valueColor="text-emerald-600"
        />
      </div>

      {/* ─── 3. Trends & Course Revenue Charts ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Course (Donut Chart) */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Revenue by Course
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revenue breakdown across your courses for this period
            </p>
          </div>

          <div className="h-[260px] w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(val, name, item) => {
                      if (item?.payload?.isEmpty) {
                        return ["$0", "No Revenue"];
                      }
                      return [`$${Number(val).toLocaleString()}`, name];
                    }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  <Pie
                    data={revenueByCourseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={revenueByCourseData.length > 1 ? 4 : 0}
                    dataKey="value"
                  >
                    {revenueByCourseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isEmpty
                            ? "#cbd5e1"
                            : DONUT_COLORS[index % DONUT_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Enrollments Trend (Line Chart) */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Enrollments Trend
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {periodBreakdownText}
            </p>
          </div>

          <div className="h-[260px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={enrollmentsChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(val) => [val, "Enrollments"]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 4. Course Performance Table ────────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Course Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Top 5 courses ranked by student enrollments. Revenue is all-time and
            not affected by the selected period.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "title",
              label: "Course Title",
              render: (_: unknown, row: InstructorCoursePerformance) => (
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-foreground">
                    {row.courseTitle || row.title}
                  </span>
                  <div>
                    {row.isVerified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: "enrollments",
              label: "Enrollments",
              render: (value: number) => <span>{value ?? 0}</span>,
            },
            {
              key: "rating",
              label: "Rating",
              render: (value: number) => (
                <span>{value && value > 0 ? value.toFixed(1) : "-"}</span>
              ),
            },
            {
              key: "avgCompletion",
              label: "Avg. Completion",
              render: (value: number) => (
                <div className="flex flex-col gap-1 max-w-[120px]">
                  <span className="text-muted-foreground">
                    {Number(value ?? 0).toFixed(1)}%
                  </span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(Math.max(value ?? 0, 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: "revenue",
              label: "Revenue",
              render: (value: number) => (
                <span className="font-semibold text-emerald-600">
                  ${value ?? 0}
                </span>
              ),
            },
          ]}
          data={data?.coursePerformance ?? []}
        />
      </div>

      {/* ─── 5. Recent Reviews Table ────────────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Recent Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            5 most recent reviews across all your courses, regardless of the
            selected period.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "courseTitle",
              label: "Course",
              render: (_: unknown, row: InstructorRecentReview) => (
                <span className="font-medium text-foreground">
                  {row.courseTitle}
                </span>
              ),
            },
            {
              key: "studentName",
              label: "Student",
              render: (_: unknown, row: InstructorRecentReview) => (
                <span className="text-muted-foreground">{row.studentName}</span>
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
              label: "Review",
              render: (_: unknown, row: InstructorRecentReview) => (
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
          data={data?.recentReviews ?? []}
        />
      </div>
    </PageFlexCol>
  );
};

export default InstructorDashboard;
