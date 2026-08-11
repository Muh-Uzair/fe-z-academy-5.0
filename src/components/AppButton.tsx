import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface AppButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    { className, children, isLoading, leftIcon, rightIcon, disabled, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={className}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && (
          <span className="flex items-center justify-center mr-2">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="flex items-center justify-center ml-2">
            {rightIcon}
          </span>
        )}
      </Button>
    );
  }
);
AppButton.displayName = "AppButton";

export default AppButton;
