"use client";

import AppErrorScreen from "@/components/AppErrorScreen";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <AppErrorScreen error={error} onRetry={unstable_retry} />;
}
