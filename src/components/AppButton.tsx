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
      loading,
      ...props
    },
    ref,
  ) => {
    // `isLoading` and the underlying Button's own `loading` prop both mean
    // "this button is busy" — accept either so the left icon (`leftIcon` or
    // the primitive `iconLeft`) is hidden in favor of the spinner no matter
    // which one the caller passed.
    const busy = isLoading ?? loading ?? false;

    // The underlying Button already renders its own spinner in place of
    // `iconLeft` when `loading` is true (forwarded below), so this only
    // needs to hide `leftIcon` while busy — not render a second spinner.
    const content = (
      <>
        {!busy && LeftIcon && <AppIcon icon={LeftIcon} className="mr-1" />}
        {children}
        {RightIcon && <AppIcon icon={RightIcon} className="ml-1" />}
      </>
    );

    if (href) {
      return (
        <Button
          asChild
          loading={busy}
          disabled={busy || disabled}
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
        loading={busy}
        disabled={busy || disabled}
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
