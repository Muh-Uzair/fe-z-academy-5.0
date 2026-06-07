"use client";

import React, { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Briefcase, Mail } from "lucide-react";

interface UserCardProps {
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string | null;
    role: string;
    highestEducation?: string;
    yearsOfExperience?: number;
    bio?: string;
  };
  footer?: ReactNode;
}

const UserCard = ({ user, footer = null }: UserCardProps) => {
  return (
    <div className="w-full rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Header section with avatar */}
      <div className="relative pt-8 pb-4 px-5 flex flex-col items-center bg-muted/30">
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="shadow-sm capitalize border border-border/50">
            {user.role}
          </Badge>
        </div>
        
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
          alt={user.fullName}
          className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md group-hover:scale-105 transition-transform duration-500"
        />
        
        <h2 className="font-bold text-lg mt-4 text-center line-clamp-1 group-hover:text-primary transition-colors">
          {user.fullName}
        </h2>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{user.email}</span>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {user.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}

        <div className="mt-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
            {user.highestEducation && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="truncate">{user.highestEducation}</span>
              </div>
            )}
            {user.yearsOfExperience !== undefined && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="truncate">{user.yearsOfExperience} yrs exp</span>
              </div>
            )}
          </div>

          {footer && (
            <>
              <Separator className="mb-4" />
              <div className="flex flex-col gap-2">
                {footer}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
