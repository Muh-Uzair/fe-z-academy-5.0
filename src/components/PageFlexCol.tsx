"use client";

import React, { ReactNode } from "react";
import FlexCol from "./FlexCol";

interface PageFlexColProps {
  children: ReactNode;
}

const PageFlexCol = ({ children }: PageFlexColProps) => {
  return <FlexCol>{children}</FlexCol>;
};

export default PageFlexCol;
