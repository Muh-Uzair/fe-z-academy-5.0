"use client";

import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

interface AppTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  upperHeader?: ReactNode;
  pagination?: boolean;
}

const AppTable = ({
  columns = [],
  data = [],
  upperHeader = null,
  pagination = false,
}: AppTableProps) => {
  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="rounded-t-xl pb-6">{upperHeader}</div>

      {/* ✅ border + radius + overflow-hidden on YOUR div, not on <Table> */}
      <div className="border rounded-xl overflow-hidden mb-6">
        <Table className="bg-white text-[12px]">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  className="uppercase text-muted-foreground p-4"
                  key={col.key}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col.key} className="p-4">
                    {col.render
                      ? col.render(row?.[col.key], row)
                      : row?.[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="shrink-0 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Showing 1–5 of 24
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

export default AppTable;
