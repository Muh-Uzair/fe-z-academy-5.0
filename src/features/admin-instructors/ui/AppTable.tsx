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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AppTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  upperHeader?: ReactNode;
}

const AppTable = ({
  columns = [],
  data = [],
  upperHeader = null,
}: AppTableProps) => {
  return (
    <div className="flex flex-col">
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AppTable;
