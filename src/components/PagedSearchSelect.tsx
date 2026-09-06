"use client";

import { useState } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronsUpDown } from "lucide-react";

import AppSearchBar from "@/components/AppSearchBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { Pagination } from "@/response-types/userResponseTypes";

export interface PagedSearchSelectItem {
  id: string;
  label: string;
}

interface PagedSearchSelectProps {
  items: PagedSearchSelectItem[];
  pagination: Pagination;
  search: string;
  value: string;
  onValueChange: (id: string) => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  // Shown on the trigger when the selected item isn't in the current page of
  // `items` (e.g. editing a record whose category is on a different page).
  selectedLabel?: string | null;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

// A Select-like trigger that opens a searchable, paginated list. Search and
// page changes are driven entirely by the caller (typically by updating the
// page's URL query params, the same pattern used by the admin list pages) —
// this component holds no data of its own.
const PagedSearchSelect = ({
  items,
  pagination,
  search,
  value,
  onValueChange,
  onSearchChange,
  onPageChange,
  selectedLabel,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: PagedSearchSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === value);
  const triggerLabel = selectedItem?.label ?? selectedLabel ?? null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !triggerLabel && "text-muted-foreground",
            className,
          )}
        >
          {triggerLabel ?? placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[300px] rounded-lg border bg-popover text-popover-foreground shadow-md outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <div className="p-2">
            <AppSearchBar
              placeholder={searchPlaceholder}
              defaultValue={search}
              onChange={onSearchChange}
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {items.length === 0 ? (
              <p className="p-3 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onValueChange(item.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  {item.label}
                  {item.id === value ? (
                    <Check className="size-4" />
                  ) : null}
                </button>
              ))
            )}
          </div>

          {pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between gap-2 border-t p-2">
              <span className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => onPageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => onPageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default PagedSearchSelect;
export type { PagedSearchSelectProps };
