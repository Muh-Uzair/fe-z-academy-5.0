"use client";

import { useOptimistic, useTransition } from "react";
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
import {
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AdminDashboardData } from "@/response-types/dashboardResponseTypes";

const REVENUE_CONFIG = {
  revenue: {
    label: "Total Revenue ($)",
    color: "var(--primary)",
  },
  commission: {
    label: "Admin Commission ($)",
    color: "var(--primary-dark)",
  },
} satisfies ChartConfig;

const USER_CONFIG = {
  students: {
    label: "New Students",
    color: "var(--primary)",
  },
  instructors: {
    label: "New Instructors",
    color: "var(--primary-dark)",
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

interface AdminDashboardProps {
  data: AdminDashboardData;
  period?: "week" | "month" | "year";
}

const AdminDashboard = ({ data, period }: AdminDashboardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPeriod = period ?? data.period;
  const [selectedPeriod, setSelectedPeriod] = useOptimistic(currentPeriod);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (nextPeriod: "week" | "month" | "year") => {
    startTransition(() => {
      setSelectedPeriod(nextPeriod);
      router.push(`${pathname}?period=${nextPeriod}`, { scroll: false });
    });
  };

  const summary = data.summary;
  const revTrend = formatPercentTrend(
    summary.totalRevenue.changePercent,
    currentPeriod
  );
  const commTrend = formatPercentTrend(
    summary.totalCommission.changePercent,
    currentPeriod
  );
  const studTrend = formatPercentTrend(
    summary.totalStudents.changePercent,
    currentPeriod
  );
  const instTrend = formatPercentTrend(
    summary.totalInstructors.changePercent,
    currentPeriod
  );
  const crsTrend = formatPercentTrend(
    summary.totalCourses.changePercent,
    currentPeriod
  );

  const platformStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue.current),
      icon: DollarSign,
      trend: revTrend.trend,
      trendValue: revTrend.trendValue,
      iconColor: "text-primary-dark",
      iconBg: "bg-primary-very-light",
    },
    {
      title: "Admin Commission",
      value: formatCurrency(summary.totalCommission.current),
      icon: TrendingUp,
      trend: commTrend.trend,
      trendValue: commTrend.trendValue,
      iconColor: "text-primary-dark",
      iconBg: "bg-primary-very-light",
    },
    {
      title: "Total Students",
      value: summary.totalStudents.current.toLocaleString(),
      icon: Users,
      trend: studTrend.trend,
      trendValue: studTrend.trendValue,
      iconColor: "text-primary-dark",
      iconBg: "bg-primary-very-light",
    },
    {
      title: "Total Instructors",
      value: summary.totalInstructors.current.toLocaleString(),
      icon: GraduationCap,
      trend: instTrend.trend,
      trendValue: instTrend.trendValue,
      iconColor: "text-primary-dark",
      iconBg: "bg-primary-very-light",
    },
    {
      title: "Total Courses",
      value: summary.totalCourses.current.toLocaleString(),
      icon: BookOpen,
      trend: crsTrend.trend,
      trendValue: crsTrend.trendValue,
      iconColor: "text-primary-dark",
      iconBg: "bg-primary-very-light",
    },
  ];

  const chartRevenueData = data.revenueTrend.map((pt) => ({
    label: formatBucketLabel(pt.label, currentPeriod),
    rawLabel: pt.label,
    revenue: pt.totalRevenue / 100,
    commission: pt.adminCommission / 100,
  }));

  const chartUserData = data.userGrowth.map((pt) => ({
    label: formatBucketLabel(pt.label, currentPeriod),
    rawLabel: pt.label,
    students: pt.newStudents,
    instructors: pt.newInstructors,
  }));

  const courseColumns = [
    { key: "title", label: "Course Title" },
    { key: "instructorName", label: "Instructor" },
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
      key: "totalRevenueAdmin",
      label: "Commission Earned",
      render: (val: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(val ?? 0)}
        </span>
      ),
    },
  ];

  const userColumns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (val: string) => (
        <Badge
          variant={
            val === "instructor"
              ? "default"
              : val === "admin"
                ? "outline"
                : "secondary"
          }
          className="capitalize"
        >
          {val}
        </Badge>
      ),
    },
    {
      key: "isVerified",
      label: "Status",
      render: (val: boolean) => (
        <Badge
          variant={val ? "default" : "outline"}
          className={
            val
              ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20"
              : "text-amber-600 border-amber-200 bg-amber-500/10"
          }
        >
          {val ? "Verified" : "Pending Verification"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of platform performance, user metrics, and revenue.
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
          {platformStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">{periodSubtitle}</p>
            </div>
            <ChartContainer
              config={REVENUE_CONFIG}
              className="h-[260px] w-full"
            >
              <AreaChart
                data={chartRevenueData}
                margin={{ top: 10, left: -10, right: 10, bottom: 0 }}
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
                  tickFormatter={(val) =>
                    `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span className="text-muted-foreground">
                            {name === "revenue"
                              ? "Total Revenue"
                              : "Admin Commission"}
                            :
                          </span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(Number(value) * 100)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="var(--color-revenue)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="commission"
                  stroke="var(--color-commission)"
                  fill="var(--color-commission)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
            <div className="mb-4">
              <h3 className="text-lg font-medium">User Growth</h3>
              <p className="text-sm text-muted-foreground">{periodSubtitle}</p>
            </div>
            <ChartContainer config={USER_CONFIG} className="h-[260px] w-full">
              <BarChart
                data={chartUserData}
                margin={{ top: 10, left: -10, right: 10, bottom: 0 }}
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
                      formatter={(value, name) => (
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span className="text-muted-foreground">
                            {name === "students"
                              ? "New Students"
                              : "New Instructors"}
                            :
                          </span>
                          <span className="font-semibold text-foreground">
                            {Number(value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="students"
                  fill="var(--color-students)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="instructors"
                  fill="var(--color-instructors)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Top Performing Courses
            </h2>
            <p className="text-sm text-muted-foreground">
              Top 5 courses ranked by student enrollments. Commission is all-time and not affected by the selected period.
            </p>
          </div>
          <AppTable columns={courseColumns} data={data.topCourses} />
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Recent Users</h2>
            <p className="text-sm text-muted-foreground">
              5 most recently joined users across all roles, regardless of the selected period.
            </p>
          </div>
          <AppTable columns={userColumns} data={data.recentUsers} />
        </div>
      </div>
    </PageFlexCol>
  );
};

export default AdminDashboard;

