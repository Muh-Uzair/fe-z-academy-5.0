"use client";

import { useCallback, useState } from "react";
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

// Pure, reusable action runner. Shows API-level toasts for normalized responses.
// Does NOT swallow network/unexpected errors — those will bubble to the caller.
export async function clientSideActionWrapper<T>(
  action: () => Promise<T>,
): Promise<T | undefined> {
  const result = await action();

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
}

// Hook that manages loading state and delegates to clientSideActionWrapper.
export function useClientAction() {
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async <T>(action: () => Promise<T>): Promise<T | undefined> => {
      setIsLoading(true);
      try {
        const res = await clientSideActionWrapper(action);
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { run, isLoading } as const;
}

export default useClientAction;
