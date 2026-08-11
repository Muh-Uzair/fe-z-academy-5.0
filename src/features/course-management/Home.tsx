"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MonitorPlay, Users, Award, Star, ArrowRight } from "lucide-react";

import AppButton from "@/components/AppButton";
import { Input } from "@/components/ui/input";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";

import { coursesData as mockCourses } from "@/dummy-data/coursesData";

const categories = [
  { name: "Development", icon: <MonitorPlay className="h-6 w-6" />, count: "1.2k Courses" },
  { name: "Design", icon: <Star className="h-6 w-6" />, count: "850 Courses" },
  { name: "Business", icon: <Users className="h-6 w-6" />, count: "600 Courses" },
  { name: "Marketing", icon: <Award className="h-6 w-6" />, count: "400 Courses" },
];

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      <PublicNavbar />

      {/* Modern Hero Section */}
      <section className="relative w-full pt-20 pb-24 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-dark/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-[1200px] mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Master New Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                Advance Your Career
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Join millions of learners from around the world. Access thousands of expert-led courses, ranging from web development to business design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What do you want to learn today?"
                  className="w-full pl-12 pr-4 h-14 rounded-full text-base bg-background shadow-sm border-border/60 focus-visible:ring-primary/50"
                />
              </div>
              <AppButton size="lg" className="h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-base">
                Search Courses
              </AppButton>
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full"><Users className="h-4 w-4 text-primary" /></div>
                <span>50k+ Active Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full"><MonitorPlay className="h-4 w-4 text-primary" /></div>
                <span>2,000+ Courses</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block z-10">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-border/50">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="Student learning online"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-background p-5 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4 animate-bounce hover:animate-none transition-all duration-300" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="font-bold text-foreground">Top Instructors</p>
                <p className="text-xs text-muted-foreground">Learn from the best</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Explore Top Categories</h2>
            <p className="text-muted-foreground mt-2">Find the perfect course for your career goals.</p>
          </div>
          <Link href="/courses" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-md">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-6">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Courses</h2>
              <p className="text-muted-foreground mt-2">Hand-picked courses by our expert team.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {mockCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                footer={
                  <Link href={`/courses/${course._id}`} className="w-full">
                    <AppButton className="w-full font-bold">View Details</AppButton>
                  </Link>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Split Info Section */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </div>
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <Badge variant="outline" className="w-fit text-primary border-primary/30">For Businesses</Badge>
            <h2 className="text-4xl font-bold text-foreground leading-tight">Upskill your entire team with Z-Academy Business</h2>
            <p className="text-lg text-muted-foreground">
              Get unlimited access to top courses for your team. Empower your workforce with the skills they need to stay competitive in the digital age.
            </p>
            <ul className="space-y-4 mt-2">
              {[
                "Unlimited access to 2,000+ top-rated courses",
                "Detailed analytics and learning paths",
                "Dedicated customer success manager"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1 rounded-full"><Star className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <AppButton size="lg" variant="outline" className="w-fit mt-4 border-primary text-primary hover:bg-primary/5">
              Discover Z-Academy Business
            </AppButton>
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-20 px-6 bg-primary/5 border-t border-primary/10">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground mt-2">What other students are learning right now.</p>
            </div>
            <Link href="/courses" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors">
              Explore All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {mockCourses.slice(3, 6).map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                footer={
                  <Link href={`/courses/${course._id}`} className="w-full">
                    <AppButton className="w-full font-bold">View Details</AppButton>
                  </Link>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
