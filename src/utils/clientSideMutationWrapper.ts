"use client";

import { toast } from "@/components/ui/toast";

type ApiPayload = {
  status?: "success" | "fail" | "error";
  message?: string;
  data?: null | { errors?: Array<{ field?: string; message?: string }> };
};

function formatFieldErrors(payload: ApiPayload): string | undefined {
  if (
    payload.data &&
    typeof payload.data === "object" &&
    Array.isArray(payload.data.errors)
  ) {
    const fieldErrors = payload.data.errors
      .map((item) => {
        if (item.field && item.message) return `${item.field}: ${item.message}`;
        return item.message ?? undefined;
      })
      .filter(Boolean)
      .join("; ");

    return fieldErrors || undefined;
  }

  return undefined;
}

function safeMessage(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  if (
    typeof value === "object" &&
    "message" in value &&
    typeof (value as { message: unknown }).message === "string"
  ) {
    return (value as { message: string }).message;
  }
  return undefined;
}

// Responsibilities:
// - Execute the provided server action / mutation on behalf of the caller.
// - On API error (response with status "fail" | "error") show an error toast using the API message as the title and, when present, validation field errors as the description (per docs/errorHandling.md).
// - On success show a success toast containing only the API response "message" and return the API response to the caller.
// - No other side-effects or features.
export async function clientSideMutationWrapper<T>(
  action: () => Promise<T>,
): Promise<T | undefined> {
  try {
    const result = await action();

    console.log("result ---------------------------- \n", result);

    const payload = result as unknown as ApiPayload;

    // If server returned a normalized error payload, show it and return undefined.
    if (
      payload &&
      typeof payload === "object" &&
      (payload.status === "fail" || payload.status === "error")
    ) {
      const title = payload.message ?? "Request failed";
      const description = formatFieldErrors(payload);

      // Show API message as title and field errors (if any) as description.
      toast.add({ type: "error", title, description });

      return undefined;
    }

    // Success: show only the API message (if present) and return the full response to the caller.
    const successMessage = safeMessage(payload) || undefined;
    if (successMessage) {
      toast.add({ type: "success", title: successMessage });
    }

    return result;
  } catch (err) {
    // Non-API error (network / unexpected). Show a generic title and the humanized description.
    const description =
      safeMessage(err) ?? "Something went wrong. Please try again later.";
    toast.add({ type: "error", title: "Request failed", description });
    return undefined;
  }
}
