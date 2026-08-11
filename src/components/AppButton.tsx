import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LucideIcon } from "lucide-react";
import AppIcon from "./AppIcon";

export interface AppButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      children,
      isLoading,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={className}
        {...props}
      >
        {isLoading && <AppIcon icon={Loader2} className="mr-1 animate-spin" />}
        {!isLoading && LeftIcon && <AppIcon icon={LeftIcon} className="mr-1" />}
        {children}
        {RightIcon && <AppIcon icon={RightIcon} className="ml-1" />}
      </Button>
    );
  },
);
AppButton.displayName = "AppButton";

export default AppButton;
