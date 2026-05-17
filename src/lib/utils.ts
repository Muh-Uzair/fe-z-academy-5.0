import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateFormat = "dd/mm/yyyy" | "dd MMMM yyyy"

export function formatDate(
  dateString: string,
  format: DateFormat = "dd MMMM yyyy"
) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear())

  if (format === "dd/mm/yyyy") {
    return `${day}/${month}/${year}`
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}
