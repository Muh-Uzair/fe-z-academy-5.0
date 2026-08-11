"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Clock, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AppButton from "@/components/AppButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";

import { Course, CourseLevel } from "@/types/courseTypes";

const courseToBuy: Course = {
  _id: "course_123",
  title: "Full Stack Web Development with MERN",
  description:
    "Learn MERN stack from scratch and build real-world apps. This comprehensive course will take you from a beginner to an advanced developer. You will learn MongoDB, Express, React, and Node.js. Build RESTful APIs, manage state with Redux, and deploy your applications to the cloud.",
  thumbnail:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  videoUrl: "https://example.com/video",
  price: 49.99,
  level: CourseLevel.Beginner,
  instructor: "John Smith",
  category: "Web Development",
  isVerified: true,
  verificationRejectionReason: null,
  averageRating: 4.6,
  totalReviews: 120,
  totalStudentsEnrolled: 1500,
  totalDurationInMinutes: 420,
  totalRevenueInstructor: 0,
  totalRevenueAdmin: 0,
  slug: "course-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const similarCourses: Course[] = [
  {
    _id: "sc1",
    title: "Advanced React Patterns",
    description: "Deep dive into React architecture and patterns.",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/v1",
    price: 69.99,
    level: CourseLevel.Advanced,
    instructor: "Sarah Johnson",
    category: "Frontend Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.8,
    totalReviews: 85,
    totalStudentsEnrolled: 900,
    totalDurationInMinutes: 300,
    totalRevenueInstructor: 0,
    totalRevenueAdmin: 0,
    slug: "course-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sc2",
    title: "Node.js API Mastery",
    description: "Build scalable backend APIs using Node.js and Express.",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/v2",
    price: 39.99,
    level: CourseLevel.Intermediate,
    instructor: "Ali Khan",
    category: "Backend Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.3,
    totalReviews: 60,
    totalStudentsEnrolled: 700,
    totalDurationInMinutes: 280,
    totalRevenueInstructor: 0,
    totalRevenueAdmin: 0,
    slug: "course-3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sc3",
    title: "UI/UX Design Fundamentals",
    description: "Master modern UI/UX design principles.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/v3",
    price: 29.99,
    level: CourseLevel.Beginner,
    instructor: "Emily Watson",
    category: "Design",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.7,
    totalReviews: 140,
    totalStudentsEnrolled: 1700,
    totalDurationInMinutes: 600,
    totalRevenueInstructor: 0,
    totalRevenueAdmin: 0,
    slug: "course-4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sc4",
    title: "TypeScript for React Developers",
    description: "Learn how to use TypeScript effectively with React.",
    thumbnail:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/v4",
    price: 59.99,
    level: CourseLevel.Intermediate,
    instructor: "David Chen",
    category: "Web Development",
    isVerified: true,
    verificationRejectionReason: null,
    averageRating: 4.9,
    totalReviews: 210,
    totalStudentsEnrolled: 3000,
    totalDurationInMinutes: 400,
    totalRevenueInstructor: 0,
    totalRevenueAdmin: 0,
    slug: "course-5",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const paymentSchema = z.object({
  nameOnCard: z.string().min(2, "Name is required"),
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(16),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Must be MM/YY"),
  cvc: z.string().min(3, "CVC must be 3 or 4 digits").max(4),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const CourseCheckout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onSubmit = (values: PaymentFormValues) => {
    console.log("Checkout complete!");
    console.log("Course info:", courseToBuy);
    console.log("Card Details:", values);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-12 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden border-2">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={courseToBuy.thumbnail}
                  alt={courseToBuy.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </AspectRatio>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{courseToBuy.title}</h2>
                    <p className="text-muted-foreground font-medium">
                      By {courseToBuy.instructor} &bull; {courseToBuy.category}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="capitalize text-sm px-3 py-1 shrink-0"
                  >
                    {courseToBuy.level}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{courseToBuy.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground font-normal">
                      ({courseToBuy.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{courseToBuy.totalStudentsEnrolled} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {Math.floor(courseToBuy.totalDurationInMinutes / 60)}h{" "}
                      {courseToBuy.totalDurationInMinutes % 60}m
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {courseToBuy.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6 border-2 shadow-lg">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <CardTitle className="text-xl">Payment Details</CardTitle>
              <CardDescription>
                Complete your purchase to start learning.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 flex justify-between items-center text-xl font-bold bg-primary/10 p-4 rounded-lg">
                <span className="text-primary">Total Amount</span>
                <span>${courseToBuy.price}</span>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="nameOnCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890123456"
                            {...field}
                            maxLength={16}
                            className="h-11 font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MM/YY"
                              {...field}
                              maxLength={5}
                              className="h-11 font-mono"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              {...field}
                              maxLength={4}
                              className="h-11 font-mono"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <AppButton
                    type="submit"
                    className="w-full h-12 text-md mt-6"
                    size="lg"
                  >
                    Buy Now &bull; ${courseToBuy.price}
                  </AppButton>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
                  This is a dummy checkout page. No real payment will be
                  processed. All data will be logged to the console.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Similar Courses You Might Like
          </h2>
          <p className="text-muted-foreground mt-1">
            Explore other highly rated courses in the same category.
          </p>
        </div>

        <AppCourseCardsGridLayout
          courses={similarCourses}
          renderFooter={() => (
            <AppButton className="w-full">View Details</AppButton>
          )}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader variant="success">
            <DialogTitle className="text-xl">Payment Successful</DialogTitle>
            <DialogDescription>
              Your dummy payment has been submitted successfully! Check your
              console logs for the transaction details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AppButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseCheckout;
