"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  pageHeading: string;
  pageDescription: string;
  pageHeaderRightSection?: ReactNode;
  // true -> go back 1 step in history. A string -> navigate to that URL instead.
  backButton?: boolean | string;
}

const PageHeader = ({
  pageHeading,
  pageDescription,
  pageHeaderRightSection,
  backButton,
}: PageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof backButton === "string") {
      router.push(backButton);
      return;
    }

    router.back();
  };

  return (
    <div className="flex justify-between">
      {/* right heading */}
      <div className="flex flex-col space-y-2">
        {backButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="w-fit gap-1.5 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>
        )}

        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold">{pageHeading}</h1>

          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        </div>
      </div>

      {/* left children */}
      <div>{pageHeaderRightSection}</div>
    </div>
  );
};

export default PageHeader;
