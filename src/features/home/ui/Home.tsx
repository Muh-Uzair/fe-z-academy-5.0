"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Left: Logo */}
      <div className="text-xl font-bold text-primary">zAcademy</div>

      {/* Middle: Links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href={"/home"} className="hover:text-primary">
          Home
        </Link>

        <Link href={"/courses"} className="hover:text-primary">
          Courses
        </Link>

        <Link href={"/about-us"} className="hover:text-primary">
          About us
        </Link>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        <Button variant="ghost">Sign In</Button>
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
}

const categories = [
  "Development",
  "Design",
  "Marketing",
  "Business",
  "Data Science",
];

const featuredCourses = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `Featured Course ${i + 1}`,
  instructor: "John Doe",
  price: 49,
}));

const trendingCourses = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `Trending Course ${i + 1}`,
  instructor: "Jane Smith",
  price: 29,
}));

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-muted">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Learn Skills That Actually Matter in Real World
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Browse top courses, learn from expert instructors, and build your
          career with Z-Academy 5.0
        </p>

        <div className="mt-6 flex w-full max-w-xl gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
          />
          <Button>Search</Button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Button key={cat} variant="outline">
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="h-32 bg-gray-200 rounded" />
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
                <p className="font-medium">${course.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Courses */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Trending Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingCourses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="h-32 bg-gray-200 rounded" />
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructor}
                </p>
                <p className="font-medium">${course.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
