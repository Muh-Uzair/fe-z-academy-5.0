"use client";

import React, { ReactNode } from "react";

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
    <div className="w-full rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover hover:scale-105 transition duration-300"
        />

        <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
          ${course.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <h2 className="font-semibold text-base leading-snug line-clamp-2">
          {course.title}
        </h2>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{course.level}</span>
          <span>{course.category}</span>
        </div>

        <p className="text-sm text-gray-600">
          By{" "}
          <span className="font-medium text-gray-800">{course.instructor}</span>
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 pt-1">
          <div>⭐ {course.averageRating.toFixed(1)}</div>
          <div>{course.totalReviews} reviews</div>
          <div>{course.totalStudentsEnrolled} students</div>
          <div>{course.totalDurationInMinutes} min</div>
        </div>

        {/* Footer pinned to bottom */}
        {footer && (
          <div className="pt-3 border-t mt-auto flex gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
