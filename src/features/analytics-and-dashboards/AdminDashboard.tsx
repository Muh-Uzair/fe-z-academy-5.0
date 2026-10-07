"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  AdminDashboardData,
  DashboardPeriod,
} from "@/response-types/dashboardResponseTypes";

interface AdminDashboardProps {
  data: AdminDashboardData;
  period: DashboardPeriod;
}

const AdminDashboard = ({ data, period }: AdminDashboardProps) => {
  console.log("data --------------------------- \n", data);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePeriod = (newPeriod: DashboardPeriod) => {
    const params = new URLSearchParams();
    if (newPeriod !== "month") {
      params.set("period", newPeriod);
    }
    const query = params.toString();
    router.push(`/admin/dashboard${query ? `?${query}` : ""}`);
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


  const revenueChartData = useMemo(() => {
    return Object.entries(data?.revenueTrend ?? {}).map(([name, value]) => ({
      name,
      revenue: value,
    }));
  }, [data?.revenueTrend]);

  const userGrowthChartData = useMemo(() => {
    return Object.entries(data?.userGrowth ?? {}).map(([name, value]) => ({
      name,
      users: value,
    }));
  }, [data?.userGrowth]);

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
    totalInstructors: 0,
    totalCourses: 0,
  };

  return (
    <PageFlexCol>
      {/* ─── 1. Header with Period Selector ─────────────────────────────────── */}
      <PageHeader
        pageHeading="Admin Dashboard"
        pageDescription="Overview of platform performance, user metrics, and revenue."
        pageHeaderRightSection={
          <Select
            value={period}
            onValueChange={(val: DashboardPeriod) => updatePeriod(val)}
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
          icon={TrendingUp}
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
          title="Total Instructors"
          value={stats.totalInstructors}
          icon={GraduationCap}
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
      </div>

      {/* ─── 3. Trends & Growth Charts ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Revenue Trend
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {periodBreakdownText}
            </p>
          </div>

          <div className="h-[260px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    formatter={(val) => [
                      `$${Number(val).toLocaleString()}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              User Growth
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {periodBreakdownText}
            </p>
          </div>

          <div className="h-[260px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userGrowthChartData}
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
                    formatter={(val) => [val, "New Users"]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="users"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 4. Top Performing Courses ──────────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Top Performing Courses
          </h2>
          <p className="text-sm text-muted-foreground">
            Top 5 courses ranked by student enrollments. Commission is all-time
            and not affected by the selected period.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "title",
              label: "Course Title",
              render: (value: string) => (
                <span className="font-medium text-foreground">{value}</span>
              ),
            },
            {
              key: "instructorName",
              label: "Instructor",
              render: (value: string) => (
                <span className="text-muted-foreground">{value}</span>
              ),
            },
            {
              key: "enrollmentsInPeriod",
              label: "Enrollments",
              render: (value: number) => <span>{value ?? 0}</span>,
            },
            {
              key: "averageRating",
              label: "Rating",
              render: (value: number) => (
                <span>{value && value > 0 ? value.toFixed(1) : "-"}</span>
              ),
            },
            {
              key: "adminCommissionEarned",
              label: "Commission Earned",
              render: (value: number) => (
                <span className="font-semibold text-emerald-600">
                  ${value ?? 0}
                </span>
              ),
            },
          ]}
          data={data?.topPerformingCourses ?? []}
        />
      </div>

      {/* ─── 5. Recent Users ────────────────────────────────────────────────── */}
      <div className="flex flex-col w-full min-w-0">
        <div className="flex flex-col space-y-1 mb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Recent Users
          </h2>
          <p className="text-sm text-muted-foreground">
            5 most recently joined users across all roles, regardless of the
            selected period.
          </p>
        </div>

        <AppTable
          columns={[
            {
              key: "fullName",
              label: "Name",
              render: (value: string) => (
                <span className="font-medium text-foreground">{value}</span>
              ),
            },
            {
              key: "email",
              label: "Email",
              render: (value: string) => (
                <span className="text-muted-foreground">{value}</span>
              ),
            },
            {
              key: "role",
              label: "Role",
              render: (value: string) => {
                if (value === "instructor") {
                  return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#149887] text-white capitalize">
                      Instructor
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                    {value}
                  </span>
                );
              },
            },
            {
              key: "isVerified",
              label: "Status",
              render: (value: boolean) =>
                value ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    Not verified
                  </span>
                ),
            },
            {
              key: "createdAt",
              label: "Joined",
              render: (value: string) => (
                <span className="text-muted-foreground">
                  {formatDate(value)}
                </span>
              ),
            },
          ]}
          data={data?.recentUsers ?? []}
        />
      </div>
    </PageFlexCol>
  );
};

export default AdminDashboard;
