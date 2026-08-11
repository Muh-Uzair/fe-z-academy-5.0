import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LucideIcon } from "lucide-react";
import AppIcon from "./AppIcon";
import Link, { LinkProps } from "next/link";

export interface AppButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  href?: string;
  linkProps?: Omit<LinkProps, "href">;
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
      href,
      linkProps,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {isLoading && <AppIcon icon={Loader2} className="mr-1 animate-spin" />}
        {!isLoading && LeftIcon && <AppIcon icon={LeftIcon} className="mr-1" />}
        {children}
        {RightIcon && <AppIcon icon={RightIcon} className="ml-1" />}
      </>
    );

    if (href) {
      return (
        <Button
          asChild
          disabled={isLoading || disabled}
          className={className}
          {...props}
        >
          <Link href={href} {...linkProps}>
            {content}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={className}
        {...props}
      >
        {content}
      </Button>
    );
  },
);
AppButton.displayName = "AppButton";

export default AppButton;
