"use client";

import React from "react";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
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

// Dummy Data
const PLATFORM_STATS = [
  {
    title: "Total Revenue",
    value: "$54,230",
    icon: DollarSign,
    trend: "up" as const,
    trendValue: "12% from last month",
    iconColor: "text-green-500",
  },
  {
    title: "Total Commission (5%)",
    value: "$2,711",
    icon: TrendingUp,
    trend: "up" as const,
    trendValue: "12% from last month",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Students",
    value: "12,450",
    icon: Users,
    trend: "up" as const,
    trendValue: "4% from last month",
    iconColor: "text-purple-500",
  },
  {
    title: "Total Instructors",
    value: "340",
    icon: GraduationCap,
    trend: "neutral" as const,
    trendValue: "Same as last month",
    iconColor: "text-orange-500",
  },
  {
    title: "Total Courses",
    value: "450",
    icon: BookOpen,
    description: "400 Live, 50 Pending",
    iconColor: "text-indigo-500",
  },
];

const RECENT_USERS = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Student",
    status: "Active",
    joinedAt: "2024-05-12",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Instructor",
    status: "Pending",
    joinedAt: "2024-05-11",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Student",
    status: "Active",
    joinedAt: "2024-05-10",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Instructor",
    status: "Active",
    joinedAt: "2024-05-09",
  },
  {
    id: "5",
    name: "Evan Wright",
    email: "evan@example.com",
    role: "Student",
    status: "Suspended",
    joinedAt: "2024-05-08",
  },
];

const TOP_COURSES = [
  {
    id: "c1",
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela",
    enrollments: 4500,
    rating: 4.8,
    revenue: "$45,000",
  },
  {
    id: "c2",
    title: "Machine Learning A-Z",
    instructor: "Kirill Eremenko",
    enrollments: 3200,
    rating: 4.7,
    revenue: "$32,000",
  },
  {
    id: "c3",
    title: "React - The Complete Guide",
    instructor: "Maximilian S.",
    enrollments: 2800,
    rating: 4.9,
    revenue: "$28,000",
  },
  {
    id: "c4",
    title: "Python for Data Science",
    instructor: "Jose Portilla",
    enrollments: 2100,
    rating: 4.6,
    revenue: "$21,000",
  },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 45000 },
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 54000 },
  { month: "Jun", revenue: 61000 },
];
const REVENUE_CONFIG = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const USER_GROWTH_DATA = [
  { month: "Jan", students: 1200, instructors: 40 },
  { month: "Feb", students: 1800, instructors: 65 },
  { month: "Mar", students: 2400, instructors: 80 },
  { month: "Apr", students: 3100, instructors: 120 },
  { month: "May", students: 3800, instructors: 150 },
  { month: "Jun", students: 4500, instructors: 180 },
];
const USER_CONFIG = {
  students: {
    label: "Students",
    color: "var(--primary-light)",
  },
  instructors: {
    label: "Instructors",
    color: "var(--primary-dark)",
  },
} satisfies ChartConfig;

const AdminDashboard = () => {
  const userColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (val: string) => (
        <Badge variant={val === "Instructor" ? "default" : "secondary"}>
          {val}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: string) => (
        <Badge
          variant={
            val === "Active"
              ? "default"
              : val === "Pending"
                ? "outline"
                : "destructive"
          }
          className={
            val === "Active"
              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              : ""
          }
        >
          {val}
        </Badge>
      ),
    },
    { key: "joinedAt", label: "Joined" },
  ];

  const courseColumns = [
    { key: "title", label: "Course Title" },
    { key: "instructor", label: "Instructor" },
    { key: "enrollments", label: "Enrollments" },
    {
      key: "rating",
      label: "Rating",
      render: (val: number) => (
        <span className="text-yellow-500 font-medium">★ {val}</span>
      ),
    },
    {
      key: "revenue",
      label: "Revenue Generated",
      render: (val: string) => (
        <span className="font-semibold text-green-600">{val}</span>
      ),
    },
  ];

  return (
    <PageFlexCol>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of platform performance, user metrics, and revenue.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PLATFORM_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">
              Monthly revenue over the last 6 months
            </p>
          </div>
          <ChartContainer config={REVENUE_CONFIG} className="h-[250px] w-full">
            <AreaChart
              data={REVENUE_DATA}
              margin={{ top: 10, left: -20, right: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col h-auto">
          <div className="mb-4">
            <h3 className="text-lg font-medium">User Growth</h3>
            <p className="text-sm text-muted-foreground">
              New students and instructors joined
            </p>
          </div>
          <ChartContainer config={USER_CONFIG} className="h-[250px] w-full">
            <BarChart
              data={USER_GROWTH_DATA}
              margin={{ top: 10, left: -20, right: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
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
        <h2 className="text-2xl font-bold tracking-tight">
          Top Performing Courses
        </h2>
        <AppTable columns={courseColumns} data={TOP_COURSES} />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recent Users</h2>
        <AppTable columns={userColumns} data={RECENT_USERS} pagination={true} />
      </div>
    </PageFlexCol>
  );
};

export default AdminDashboard;
