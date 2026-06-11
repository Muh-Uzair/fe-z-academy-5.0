"use client";

import React from "react";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/dashboard/StatCard";
import AppTable from "@/components/AppTable";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

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
        {/* Placeholder for Revenue Trend Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center h-64">
          <TrendingUp className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Revenue Trend Chart
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Chart integration will go here
          </p>
        </div>

        {/* Placeholder for User Growth Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center h-64">
          <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium text-muted-foreground">
            User Growth Chart
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Chart integration will go here
          </p>
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
