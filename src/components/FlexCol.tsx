import React, { HTMLAttributes, ReactNode } from "react";

interface FlexColProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: string;
}

const FlexCol = ({
  children,
  gap = "gap-6",
  className = "",
  ...props
}: FlexColProps) => {
  return (
    <div className={`flex flex-col min-w-0 w-full ${gap} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default FlexCol;
