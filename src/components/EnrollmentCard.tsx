"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";

interface EnrollmentCardProps {
  enrollment: Enrollment;
  footer?: ReactNode;
}

const EnrollmentCard = ({ enrollment, footer = null }: EnrollmentCardProps) => {
  const { courseDetails, studentDetails, instructorDetails, transactionDetails } =
    enrollment;

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        enrollment.watchedCompletely
          ? "border-2 border-amber-400"
          : "border"
      } group flex flex-col`}
    >
      <div className="relative w-full overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={courseDetails.thumbnailUrl}
            alt={courseDetails.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </AspectRatio>
        <Badge className="absolute left-3 top-3 capitalize">
          {courseDetails.level}
        </Badge>
        <div className="absolute right-3 top-3 rounded-md bg-black/80 px-2 py-1 text-xs text-white">
          ${courseDetails.price}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{courseDetails.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({courseDetails.totalReviews})
            </span>
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              enrollment.watchedCompletely
                ? "text-emerald-600"
                : "text-muted-foreground"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {enrollment.watchedCompletely ? "Completed" : "In progress"}
            </span>
          </div>
        </div>

        <h2 className="mb-2 line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary">
          {courseDetails.title}
        </h2>

        <p className="mb-4 text-sm text-muted-foreground">
          Instructor:{" "}
          <span className="font-medium text-foreground">
            {instructorDetails.fullName}
          </span>
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <UserRound className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{studentDetails.fullName}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">
              {courseDetails.totalStudentsEnrolled} students
            </span>
          </div>
        </div>

        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Course progress</span>
            <span>{Math.round(enrollment.watchPercentage)}%</span>
          </div>
          <Progress value={enrollment.watchPercentage} />
          <p className="text-xs text-muted-foreground">
            {enrollment.totalDurationWatchedInMinutes} minutes watched
          </p>
        </div>

        <Separator className="mb-4" />

        <div className="mt-auto space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              Enrolled
            </span>
            <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Payment</span>
            <span className="font-medium capitalize text-foreground">
              {transactionDetails.paymentStatus} · $
              {transactionDetails.amountPaid}
            </span>
          </div>
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default EnrollmentCard;
