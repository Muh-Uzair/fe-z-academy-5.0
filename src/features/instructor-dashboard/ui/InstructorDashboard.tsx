"use client";

import React from "react";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/dashboard/StatCard";
import AppTable from "@/components/AppTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Users,
  BookOpen,
  Star,
  Wallet,
  PieChart,
} from "lucide-react";

// Dummy Data
const INSTRUCTOR_STATS = [
  {
    title: "Total Revenue",
    value: "$14,500",
    icon: DollarSign,
    trend: "up" as const,
    trendValue: "+$1,200 this month",
    iconColor: "text-green-500",
  },
  {
    title: "Admin Commission (5%)",
    value: "$725",
    icon: Wallet,
    description: "Paid to platform",
    iconColor: "text-red-500",
  },
  {
    title: "Total Students",
    value: "3,450",
    icon: Users,
    trend: "up" as const,
    trendValue: "+120 this week",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Courses",
    value: "12",
    icon: BookOpen,
    description: "10 Live, 2 Pending",
    iconColor: "text-purple-500",
  },
  {
    title: "Average Rating",
    value: "4.7",
    icon: Star,
    description: "Across all courses",
    iconColor: "text-yellow-500",
  },
];

const COURSE_PERFORMANCE = [
  {
    id: "c1",
    title: "Mastering React 18",
    enrollments: 1200,
    rating: 4.8,
    revenue: "$12,000",
    completionRate: 65,
    status: "Live",
  },
  {
    id: "c2",
    title: "Advanced Node.js Patterns",
    enrollments: 850,
    rating: 4.6,
    revenue: "$8,500",
    completionRate: 50,
    status: "Live",
  },
  {
    id: "c3",
    title: "Fullstack Next.js",
    enrollments: 1400,
    rating: 4.9,
    revenue: "$14,000",
    completionRate: 72,
    status: "Live",
  },
  {
    id: "c4",
    title: "GraphQL for Beginners",
    enrollments: 0,
    rating: 0,
    revenue: "$0",
    completionRate: 0,
    status: "Pending",
  },
];

const RECENT_REVIEWS = [
  {
    id: "1",
    course: "Mastering React 18",
    student: "Alice J.",
    rating: 5,
    comment: "Amazing course! Very detailed and practical.",
    date: "2 days ago",
  },
  {
    id: "2",
    course: "Fullstack Next.js",
    student: "Mark D.",
    rating: 4,
    comment: "Great content, but pace is a bit fast.",
    date: "4 days ago",
  },
  {
    id: "3",
    course: "Advanced Node.js Patterns",
    student: "Sarah W.",
    rating: 5,
    comment: "Exactly what I needed for my senior dev role.",
    date: "1 week ago",
  },
];

const InstructorDashboard = () => {
  const courseColumns = [
    {
      key: "title",
      label: "Course Title",
      render: (val: string, row: any) => (
        <div>
          <div className="font-medium">{val}</div>
          <Badge
            variant={row.status === "Live" ? "default" : "secondary"}
            className={
              row.status === "Live"
                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 mt-1"
                : "mt-1"
            }
          >
            {row.status}
          </Badge>
        </div>
      ),
    },
    { key: "enrollments", label: "Enrollments" },
    {
      key: "rating",
      label: "Rating",
      render: (val: number) =>
        val > 0 ? (
          <span className="text-yellow-500 font-medium">★ {val}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "completionRate",
      label: "Avg. Completion",
      render: (val: number) => (
        <div className="w-[100px]">
          <div className="text-xs text-muted-foreground mb-1">{val}%</div>
          <Progress value={val} className="h-1.5" />
        </div>
      ),
    },
    {
      key: "revenue",
      label: "Revenue",
      render: (val: string) => (
        <span className="font-semibold text-green-600">{val}</span>
      ),
    },
  ];

  const reviewColumns = [
    { key: "course", label: "Course" },
    { key: "student", label: "Student" },
    {
      key: "rating",
      label: "Rating",
      render: (val: number) => (
        <span className="text-yellow-500 font-medium">
          {"★".repeat(val)}
          {"☆".repeat(5 - val)}
        </span>
      ),
    },
    {
      key: "comment",
      label: "Review",
      render: (val: string) => (
        <span className="text-muted-foreground italic line-clamp-1 max-w-[300px]">
          "{val}"
        </span>
      ),
    },
    { key: "date", label: "Date" },
  ];

  return (
    <PageFlexCol>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Instructor Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your course performance, enrollments, and earnings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {INSTRUCTOR_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Placeholder for Earnings Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center h-64">
          <PieChart className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Monthly Earnings Chart
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Chart integration will go here
          </p>
        </div>

        {/* Placeholder for Enrollments Chart */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center h-64">
          <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Enrollments Chart
          </h3>
          <p className="text-sm text-muted-foreground/70">
            Chart integration will go here
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Course Performance
        </h2>
        <AppTable columns={courseColumns} data={COURSE_PERFORMANCE} />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recent Reviews</h2>
        <AppTable columns={reviewColumns} data={RECENT_REVIEWS} />
      </div>
    </PageFlexCol>
  );
};

export default InstructorDashboard;
