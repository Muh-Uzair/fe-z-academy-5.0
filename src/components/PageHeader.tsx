"use client";

import React, { ReactNode } from "react";

interface PageHeaderProps {
  pageHeading: string;
  pageDescription: string;
  pageHeaderLeftSection?: ReactNode;
}

const PageHeader = ({
  pageHeading,
  pageDescription,
  pageHeaderLeftSection,
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between">
      {/* right heading */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">{pageHeading}</h1>

        <p className="text-sm text-muted-foreground">{pageDescription}</p>
      </div>

      {/* left children */}
      <div>{pageHeaderLeftSection}</div>
    </div>
  );
};

export default PageHeader;
