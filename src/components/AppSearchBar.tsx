"use client";

import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { cn } from "@/utils/cn";

interface AppSearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  defaultValue?: string;
  debounceTime?: number;
  onChange?: (value: string) => void;
}

const AppSearchBar = ({
  placeholder = "Search...",
  className,
  inputClassName,
  defaultValue = "",
  debounceTime = 500,
  onChange,
}: AppSearchBarProps) => {
  const [search, setSearch] = useState(defaultValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(search);
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [search, debounceTime, onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={cn("pl-9 bg-white", inputClassName)}
      />
    </div>
  );
};

export default AppSearchBar;
