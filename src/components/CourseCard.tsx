"use client";

import React, { ReactNode } from "react";
import { Star, Users, Clock } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    thumbnail: string;
    price: number;
    level: string;
    instructor: string;
    category: string;
    averageRating: number;
    totalReviews: number;
    totalStudentsEnrolled: number;
    totalDurationInMinutes: number;
  };

  footer?: ReactNode;
}

const CourseCard = ({ course, footer = null }: CourseCardProps) => {
  return (
    <div className="w-full rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image Section */}
      <div className="relative w-full overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </AspectRatio>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
          ${course.price}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="shadow-sm bg-background/95 backdrop-blur-sm hover:bg-background border border-border/50">
            {course.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md capitalize">
            {course.level}
          </span>
          <div className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
            <Star className="h-4 w-4 fill-current" />
            <span>{course.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground font-normal">({course.totalReviews})</span>
          </div>
        </div>

        <h2 className="font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          By <span className="font-medium text-foreground">{course.instructor}</span>
        </p>

        <div className="mt-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="truncate">{course.totalStudentsEnrolled} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="truncate">
                {Math.floor(course.totalDurationInMinutes / 60)}h {course.totalDurationInMinutes % 60}m
              </span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Footer pinned to bottom */}
          {footer && (
            <div className="flex flex-col gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
