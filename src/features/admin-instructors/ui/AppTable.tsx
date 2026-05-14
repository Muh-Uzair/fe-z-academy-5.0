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



interface AppTableProps {
  columns?: any[];
  data?: any[];
  upperHeader?: ReactNode;
}

const AppTable = ({
  columns = [],
  data = [],
  upperHeader = null,
}: AppTableProps) => {
  return (
    <div className="flex flex-col border rounded-xl">
      <div className="bg-white rounded-t-xl p-4">{upperHeader}</div>

      <Table className="bg-white text-[12px] rounded-b-xl">
        <TableHeader>
          <TableRow className="bg-gray-100/60">
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
  );
};

export default AppTable;