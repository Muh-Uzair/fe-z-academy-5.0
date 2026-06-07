"use client";

import React, { ReactNode } from "react";
import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  role: string;
  highestEducation?: string;
  yearsOfExperience?: number;
  bio?: string;
}

interface AppUserCardsGridLayoutProps {
  users: User[];
  upperHeader?: ReactNode;
  pagination?: boolean;
  renderFooter?: (user: User) => ReactNode;
}

const AppUserCardsGridLayout = ({
  users = [],
  upperHeader = null,
  pagination = false,
  renderFooter,
}: AppUserCardsGridLayoutProps) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      {upperHeader && <div className="pb-6">{upperHeader}</div>}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            footer={renderFooter ? renderFooter(user) : null}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Showing {users.length} users
          </span>

          <div className="flex gap-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppUserCardsGridLayout;
