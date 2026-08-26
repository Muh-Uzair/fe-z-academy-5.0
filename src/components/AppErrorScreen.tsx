"use client";

import AppButton from "@/components/AppButton";

type AppErrorScreenProps = {
  error: Error & { digest?: string };
  onRetry: () => void;
};

const AppErrorScreen = ({ error, onRetry }: AppErrorScreenProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h2 className="text-xl font-semibold text-destructive">
        Something went wrong
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <AppButton onClick={onRetry}>Try again</AppButton>
    </div>
  );
};

export default AppErrorScreen;
