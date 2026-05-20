"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Award,
  PlayCircle,
  ShieldCheck,
  Globe,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/5 py-20 lg:py-32">
          <div className="max-w-[1200px] px-4 md:px-6 mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Empowering Education
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Learn Without Limits with <span className="text-primary">Z-Academy</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                  Z-Academy is a premier online learning platform connecting passionate instructors with eager students. Discover top-rated courses, track your progress, and elevate your skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/courses">
                    <Button size="lg" className="w-full sm:w-auto text-primary-foreground">
                      Explore Courses
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                      Become an Instructor
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] lg:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
                    alt="Students learning together"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 bg-card p-4 rounded-xl shadow-xl border flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">50k+</p>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="max-w-[1200px] px-4 md:px-6 mx-auto w-full">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-[800px]">
                We believe education should be accessible, engaging, and transformative. Our platform bridges the gap between expert knowledge and curious minds worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe className="h-10 w-10 text-primary" />,
                  title: "Global Reach",
                  description: "Access high-quality education from anywhere in the world, at any time.",
                },
                {
                  icon: <ShieldCheck className="h-10 w-10 text-primary" />,
                  title: "Verified Experts",
                  description: "Learn from industry professionals whose credentials have been thoroughly vetted.",
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "Trackable Growth",
                  description: "Monitor your progress with our built-in analytics and interactive dashboards.",
                },
              ].map((feature, i) => (
                <Card key={i} className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Two-Sided Platform Section */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-[1200px] px-4 md:px-6 mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Image side */}
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop"
                  alt="Instructor teaching"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content side */}
              <div className="order-1 lg:order-2 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">A Platform Designed for Everyone</h2>
                  <p className="text-lg text-muted-foreground">
                    Whether you are here to learn a new skill or share your expertise, Z-Academy provides the tools you need to succeed.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="mt-1 bg-primary/10 p-3 rounded-xl h-fit">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">For Students</h3>
                      <p className="text-muted-foreground">
                        Enroll in diverse courses, track your watch time, engage in course-specific public chats, and communicate 1-to-1 with instructors.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 bg-primary/10 p-3 rounded-xl h-fit">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">For Instructors</h3>
                      <p className="text-muted-foreground">
                        Create comprehensive courses, manage your students, view detailed earnings analytics, and build your brand.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 bg-primary/10 p-3 rounded-xl h-fit">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Interactive Learning</h3>
                      <p className="text-muted-foreground">
                        Experience seamless video playback, progress auto-saving, and rich chat features including file sharing and voice notes.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary/5 text-center border-t border-b border-primary/10">
          <div className="max-w-[1200px] px-4 md:px-6 mx-auto w-full space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Ready to start your journey?</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto">
              Join thousands of learners and experts who are already transforming their lives with Z-Academy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Learning
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  Teach on Z-Academy
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
      <PublicFooter />
    </>
  );
};

export default AboutUs;
