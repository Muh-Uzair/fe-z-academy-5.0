"use client";

import React from "react";
import PageFlexCol from "@/components/PageFlexCol";
import StatCard from "@/components/StatCard";
import AppTable from "@/components/AppTable";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/AppButton";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

// Dummy Data
const STUDENT_STATS = [
  {
    title: "Enrolled Courses",
    value: "8",
    icon: BookOpen,
    description: "3 active, 5 completed",
    iconColor: "text-blue-500",
  },
  {
    title: "Completed Courses",
    value: "5",
    icon: CheckCircle,
    trend: "up" as const,
    trendValue: "+1 this month",
    iconColor: "text-green-500",
  },
  {
    title: "Overall Progress",
    value: "65%",
    icon: TrendingUp,
    description: "Across active courses",
    iconColor: "text-purple-500",
  },
  {
    title: "Total Watch Time",
    value: "124h",
    icon: Clock,
    trend: "up" as const,
    trendValue: "+12h this week",
    iconColor: "text-orange-500",
  },
];

const CONTINUE_WATCHING = [
  {
    _id: "cw1",
    title: "Advanced System Design Patterns",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    price: 0,
    level: "Advanced",
    instructor: "Alex Chen",
    category: "Architecture",
    averageRating: 4.9,
    totalReviews: 450,
    totalStudentsEnrolled: 12000,
    totalDurationInMinutes: 800,
    totalDurationWatchedInMinutes: 450,
  },
  {
    _id: "cw2",
    title: "UI/UX Design Masterclass",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    price: 0,
    level: "Beginner",
    instructor: "Sarah Lee",
    category: "Design",
    averageRating: 4.8,
    totalReviews: 890,
    totalStudentsEnrolled: 25000,
    totalDurationInMinutes: 420,
    totalDurationWatchedInMinutes: 100,
  },
  {
    _id: "cw3",
    title: "DevOps for Absolute Beginners",
    thumbnail:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=800",
    price: 0,
    level: "Beginner",
    instructor: "Mike Smith",
    category: "DevOps",
    averageRating: 4.6,
    totalReviews: 320,
    totalStudentsEnrolled: 8000,
    totalDurationInMinutes: 600,
    totalDurationWatchedInMinutes: 550,
  },
];

const RECENT_ACTIVITY = [
  {
    id: "1",
    type: "Lesson Completed",
    title: "Introduction to Microservices",
    course: "Advanced System Design Patterns",
    date: "2 hours ago",
  },
  {
    id: "2",
    type: "Course Enrolled",
    title: "UI/UX Design Masterclass",
    course: "UI/UX Design Masterclass",
    date: "1 day ago",
  },
  {
    id: "3",
    type: "Certificate Earned",
    title: "JavaScript Fundamentals",
    course: "JavaScript Basics to Advanced",
    date: "3 days ago",
  },
  {
    id: "4",
    type: "Lesson Completed",
    title: "Docker Basics",
    course: "DevOps for Absolute Beginners",
    date: "4 days ago",
  },
];

const StudentDashboard = () => {
  const activityColumns = [
    {
      key: "type",
      label: "Activity",
      render: (val: string) => (
        <Badge
          variant={
            val === "Certificate Earned"
              ? "default"
              : val === "Course Enrolled"
                ? "secondary"
                : "outline"
          }
          className={
            val === "Certificate Earned"
              ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
              : ""
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: "title",
      label: "Details",
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      key: "course",
      label: "Course",
      render: (val: string) => (
        <span className="text-muted-foreground">{val}</span>
      ),
    },
    { key: "date", label: "Time" },
  ];

  return (
    <PageFlexCol>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning progress, resume courses, and view achievements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STUDENT_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Continue Watching
          </h2>
          <AppButton variant="ghost" className="text-primary">
            View All Courses
          </AppButton>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CONTINUE_WATCHING.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              mode="in-progress"
              footer={
                <AppButton className="w-full mt-2" leftIcon={PlayCircle}>
                  Resume Course
                </AppButton>
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
        <AppTable columns={activityColumns} data={RECENT_ACTIVITY} />
      </div>
    </PageFlexCol>
  );
};

export default StudentDashboard;
