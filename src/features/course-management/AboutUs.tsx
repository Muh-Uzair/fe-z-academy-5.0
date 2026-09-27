"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Award,
  PlayCircle,
  ShieldCheck,
  Globe,
  GraduationCap,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import AppButton from "@/components/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AboutUsProps {
  platformStats?: {
    totalStudents: number;
    totalCourses: number;
  };
}

const AboutUs = ({ platformStats }: AboutUsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + "k+";
    return num.toString();
  };

  const studentsText = platformStats ? formatNumber(platformStats.totalStudents) : "50k+";

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30 overflow-x-hidden">
        {/* Modern Hero Section */}
        <section className="relative w-full pt-28 pb-32 lg:pt-36 lg:pb-40 overflow-hidden isolate">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="absolute top-0 right-0 -z-10 w-[800px] h-[600px] bg-primary-light/30 rounded-full blur-[120px] opacity-60 mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-20%] left-[-10%] -z-10 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-multiply" />

          <div className="max-w-[1200px] px-6 mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <div className="flex flex-col gap-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark w-fit border border-primary/20 backdrop-blur-md">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Empowering Education</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter leading-[1.05] text-foreground">
                Learn Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary">Limits</span> <br />
                with <span className="relative whitespace-nowrap"><span className="relative z-10">Z-Academy</span><svg className="absolute w-full h-4 -bottom-1 left-0 text-primary-light/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/></svg></span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                Z-Academy is a premier online learning platform connecting passionate instructors with eager students. Discover top-rated courses, track your progress, and elevate your skills.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/courses">
                  <AppButton size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-lg bg-gradient-to-r from-primary to-primary-dark hover:scale-[1.02]">
                    Explore Courses
                  </AppButton>
                </Link>
                <Link href="/signup">
                  <AppButton size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary/10 font-bold text-lg hover:scale-[1.02] transition-transform">
                    Become an Instructor
                  </AppButton>
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-[600px] justify-self-center lg:justify-self-end mt-10 lg:mt-0 z-10">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5] border-8 border-white/40 dark:border-white/10 backdrop-blur-3xl transform -rotate-2 hover:rotate-0 transition-all duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop"
                  alt="Students learning together"
                  fill
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-2 sm:-left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-white/50 flex items-center gap-4 animate-[bounce_5s_infinite]">
                <div className="bg-gradient-to-br from-primary-light to-primary-dark p-3 rounded-xl text-white shadow-lg shadow-primary/30">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{studentsText}</p>
                  <p className="text-xs font-medium text-muted-foreground">Active Students</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 px-6 relative bg-muted/30">
          <div className="max-w-[1200px] mx-auto w-full relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <Badge variant="outline" className="w-fit text-primary border-primary/30 mb-2 px-4 py-1 rounded-full bg-primary/5">Our Vision</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-2xl font-medium mt-4">
                We believe education should be accessible, engaging, and transformative. Our platform bridges the gap between expert knowledge and curious minds worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe className="h-8 w-8 text-primary" />,
                  title: "Global Reach",
                  description: "Access high-quality education from anywhere in the world, at any time.",
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                  title: "Verified Experts",
                  description: "Learn from industry professionals whose credentials have been thoroughly vetted.",
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-primary" />,
                  title: "Trackable Growth",
                  description: "Monitor your progress with our built-in analytics and interactive dashboards.",
                },
              ].map((feature, i) => (
                <div key={i} className="group relative p-8 rounded-[2rem] border border-border/50 bg-card hover:bg-white dark:hover:bg-gray-900 hover:border-primary/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden flex flex-col items-center text-center text-balance h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="bg-primary/10 shadow-sm w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 mb-6 border border-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">{feature.title}</h3>
                  <p className="text-base text-muted-foreground font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two-Sided Platform Section */}
        <section className="py-32 px-6 max-w-[1200px] mx-auto w-full relative">
          <div className="absolute right-[10%] top-[20%] w-32 h-32 bg-primary-light/40 rounded-full blur-3xl -z-10"></div>
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-l from-primary-light to-primary rounded-[3rem] blur-lg opacity-30"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
                  alt="Instructor teaching"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-multiply" />
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -left-6 top-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-very-light flex items-center justify-center">
                    <CheckCircle2 className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Quality</p>
                    <p className="text-xl font-black text-gray-900">World Class</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-col gap-8 order-1 lg:order-2">
              <div>
                <Badge variant="outline" className="w-fit text-primary border-primary/30 mb-6 text-sm px-4 py-1 rounded-full bg-primary/5">Ecosystem</Badge>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-[1.1] tracking-tight">A Platform Designed for Everyone</h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Whether you are here to learn a new skill or share your expertise, Z-Academy provides the tools you need to succeed.
              </p>
              
              <div className="space-y-8 mt-4">
                {[
                  {
                    icon: <BookOpen className="h-7 w-7 text-primary" />,
                    title: "For Students",
                    desc: "Enroll in diverse courses, track your watch time, engage in course-specific public chats, and communicate 1-to-1 with instructors."
                  },
                  {
                    icon: <Award className="h-7 w-7 text-primary" />,
                    title: "For Instructors",
                    desc: "Create comprehensive courses, manage your students, view detailed earnings analytics, and build your brand."
                  },
                  {
                    icon: <PlayCircle className="h-7 w-7 text-primary" />,
                    title: "Interactive Learning",
                    desc: "Experience seamless video playback, progress auto-saving, and rich chat features including file sharing and voice notes."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <div className="mt-1 bg-primary/10 p-4 rounded-2xl h-fit group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <div className="group-hover:text-white text-primary transition-colors">{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-primary-very-dark text-background overflow-hidden relative border-t border-primary/20">
          {/* Abstract shapes */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-dark rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-primary rounded-full blur-[150px] opacity-20 translate-x-1/3 translate-y-1/3"></div>

          <div className="max-w-[1200px] mx-auto w-full relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 bg-black/20 p-8 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-xl">
              <Badge variant="outline" className="w-fit text-primary-light border-primary-light/30 px-4 py-1 bg-white/5 rounded-full">Get Started</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight max-w-3xl leading-[1.1]">
                Ready to start your <span className="text-primary-light">journey?</span>
              </h2>
              <p className="text-gray-300 text-xl max-w-2xl font-medium leading-relaxed">
                Join thousands of learners and experts who are already transforming their lives with Z-Academy.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6 w-full sm:w-auto">
                <Link href="/courses" className="w-full sm:w-auto">
                  <AppButton size="lg" className="w-full sm:w-auto h-16 px-10 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all font-bold text-lg bg-primary text-white hover:bg-primary-dark border-transparent flex items-center justify-center gap-2 group">
                    Start Learning
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </AppButton>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <AppButton size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-full border-2 border-primary-light text-primary-light hover:bg-white/10 font-bold text-lg hover:-translate-y-1 transition-all bg-transparent">
                    Teach on Z-Academy
                  </AppButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
      <PublicFooter />
    </>
  );
};

export default AboutUs;
