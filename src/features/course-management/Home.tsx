"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MonitorPlay, Users, Award, Star, ArrowRight, BookOpen, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

import AppButton from "@/components/AppButton";
import { Input } from "@/components/ui/input";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";

import type { AuthUser } from "@/response-types/authResponseTypes";
import type { TopCategory } from "@/response-types/categoryResponseTypes";
import type { PublicCourseListItem } from "@/response-types/courseResponseTypes";
import type { GetPlatformStatsResponseData } from "@/response-types/statResponseTypes";

type HomeProps = {
  user: AuthUser | null;
  topCategories: TopCategory[];
  featuredCourses: PublicCourseListItem[];
  trendingCourses: PublicCourseListItem[];
  platformStats: GetPlatformStatsResponseData;
};

export default function Home({
  user,
  topCategories,
  featuredCourses,
  trendingCourses,
  platformStats,
}: HomeProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/courses?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push(`/courses`);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden selection:bg-primary/30">
      <PublicNavbar user={user} />

      {/* Modern Hero Section */}
      <section className="relative w-full pt-28 pb-32 lg:pt-36 lg:pb-40 overflow-hidden isolate">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[600px] bg-primary-light/30 rounded-full blur-[120px] opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] left-[-10%] -z-10 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-multiply" />

        <div className="max-w-[1200px] mx-auto w-full px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="flex flex-col gap-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark w-fit border border-primary/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">The Future of Learning</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tighter leading-[1.05] text-foreground">
              Master New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary">Skills</span> <br />
              Advance Your <span className="relative whitespace-nowrap"><span className="relative z-10">Career</span><svg className="absolute w-full h-4 -bottom-1 left-0 text-primary-light/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/></svg></span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              Join millions of learners from around the world. Access thousands of expert-led courses, ranging from web development to business design.
            </p>

            <div className="relative group max-w-2xl mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-light via-primary to-primary-light rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-xl p-2 rounded-[2rem] border border-white/20 shadow-xl">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-6 text-primary h-5 w-5" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="What do you want to learn today?"
                    className="w-full pl-14 pr-6 h-14 rounded-full text-lg bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  />
                </div>
                <AppButton 
                  size="lg" 
                  onClick={handleSearch}
                  className="h-14 px-10 rounded-full shadow-md hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-bold text-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-[1.02]"
                >
                  Search Courses
                </AppButton>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-very-light text-primary shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">{platformStats.totalStudents.toLocaleString()}+</p>
                  <p className="text-sm font-semibold text-muted-foreground">Active Students</p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-very-light text-primary shadow-sm">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">{platformStats.totalCourses.toLocaleString()}+</p>
                  <p className="text-sm font-semibold text-muted-foreground">Premium Courses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block z-10 w-full max-w-[600px] justify-self-end">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] border-8 border-white/40 dark:border-white/10 backdrop-blur-3xl transform rotate-2 hover:rotate-0 transition-all duration-500">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Student learning online"
                fill
                className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-2 lg:left-0 xl:-left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-white/50 flex items-center gap-4 animate-[bounce_5s_infinite]">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 rounded-xl text-white shadow-lg shadow-yellow-500/30">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-black text-foreground">Top Instructors</p>
                <p className="text-xs font-medium text-muted-foreground">Learn from the very best</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Explore Top Categories</h2>
            <p className="text-xl text-muted-foreground font-medium">Find the perfect course for your career goals.</p>
          </div>
          <Link href="/courses" className="group flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors">
            View All Categories 
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topCategories.map((cat) => (
            <div key={cat._id} className="group relative p-8 rounded-[2rem] border border-transparent bg-muted/40 hover:bg-white hover:border-primary/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="bg-white shadow-sm w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 mb-6 border border-border/50">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <MonitorPlay className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-base text-muted-foreground font-medium mt-2">{cat.courseCount} {cat.courseCount === 1 ? 'Course' : 'Courses'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 px-6 relative bg-primary-very-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/30 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto w-full relative z-10">
          <div className="flex flex-col mb-16 text-center items-center">
            <Badge variant="outline" className="w-fit text-primary-very-light border-primary-light/30 mb-4 px-4 py-1">Hand-picked for you</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Featured Courses</h2>
            <p className="text-xl text-primary-very-light/80 font-medium mt-4 max-w-2xl">Elevate your skills with these premium, expert-curated learning paths.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {featuredCourses.map((course) => (
              <div key={course._id} className="group transition-transform duration-300 hover:-translate-y-2 h-full">
                <CourseCard
                  course={course}
                  footer={
                    <Link href={`/courses/${course._id}`} className="w-full">
                      <AppButton className="w-full font-bold h-12 shadow-md hover:shadow-xl transition-shadow bg-primary hover:bg-primary-dark border-transparent text-white">View Details</AppButton>
                    </Link>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Split Section */}
      <section className="py-32 px-6 max-w-[1200px] mx-auto w-full relative">
        <div className="absolute left-[10%] top-[20%] w-24 h-24 bg-primary-light/40 rounded-full blur-2xl -z-10"></div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-light to-primary rounded-[3rem] blur-lg opacity-30"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                alt="Students in a classroom"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-multiply" />
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -right-6 top-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Completion</p>
                  <p className="text-xl font-black text-gray-900">98% Success</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8 order-1 lg:order-2">
            <div>
              <Badge variant="outline" className="w-fit text-primary border-primary/30 mb-6 text-sm px-4 py-1 rounded-full bg-primary/5">Your Learning Partner</Badge>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-[1.1] tracking-tight">Unlock your true potential with Z-Academy</h2>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Join a vibrant community of learners and get access to world-class education from the comfort of your home. Master the skills you need to achieve your career goals.
            </p>
            <ul className="space-y-6 mt-4">
              {[
                "Learn from top industry experts and professionals",
                "Flexible learning on any device, anywhere",
                "Earn certificates to showcase your new skills"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-5">
                  <div className="bg-primary/10 p-3 rounded-2xl shrink-0 mt-1"><Star className="h-6 w-6 text-primary" /></div>
                  <span className="font-semibold text-lg text-foreground leading-tight">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/courses">
              <AppButton size="lg" className="w-fit mt-6 px-10 h-16 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all font-bold text-lg flex items-center gap-2 group bg-gradient-to-r from-primary to-primary-dark">
                Start Learning Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </AppButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-32 px-6 bg-gradient-to-b from-primary-very-light/30 to-transparent border-t border-primary/10 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-light/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto w-full relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Trending Now</h2>
              <p className="text-xl text-muted-foreground font-medium">What other students are learning right now.</p>
            </div>
            <Link href="/courses" className="group flex items-center gap-2 text-primary font-bold text-lg hover:text-primary-dark transition-colors">
              Explore All 
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {trendingCourses.map((course) => (
              <div key={course._id} className="group transition-transform duration-300 hover:-translate-y-2 h-full">
                <CourseCard
                  course={course}
                  footer={
                    <Link href={`/courses/${course._id}`} className="w-full">
                      <AppButton className="w-full font-bold h-12 shadow-sm group-hover:shadow-md transition-shadow">View Details</AppButton>
                    </Link>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Instructor Section */}
      <section className="py-32 px-6 bg-foreground text-background overflow-hidden relative">
        {/* Abstract shapes */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-dark rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-primary rounded-full blur-[150px] opacity-20 translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[1200px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center bg-background/5 p-8 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <div>
                <Badge variant="outline" className="w-fit text-primary-light border-primary-light/30 mb-6 px-4 py-1 bg-white/5 rounded-full">For Instructors</Badge>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">Become an <span className="text-primary-light">Instructor</span></h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-lg">
                Instructors from around the world teach millions of students on Z-Academy. We provide the tools and skills to teach what you love.
              </p>
              <ul className="space-y-6 mt-2">
                {[
                  "Earn money by sharing your expertise",
                  "Inspire students globally with your courses",
                  "Get access to exclusive instructor tools"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5">
                    <div className="bg-primary/20 p-3 rounded-2xl"><BookOpen className="h-6 w-6 text-primary-light" /></div>
                    <span className="font-semibold text-lg text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <AppButton size="lg" className="w-fit mt-6 px-10 h-16 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all font-bold text-lg bg-primary text-white hover:bg-primary-dark border-transparent">
                  Start Teaching Today
                </AppButton>
              </Link>
            </div>
            
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] order-1 lg:order-2 border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                alt="Instructor working on a course"
                fill
                className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
