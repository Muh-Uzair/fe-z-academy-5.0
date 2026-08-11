import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AppIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: LucideIcon;
  /**
   * The size of the icon. Defaults to 16 (standard button icon size).
   * Can also be controlled via Tailwind classes (e.g., className="w-4 h-4").
   */
  size?: number | string;
}

const AppIcon = ({
  icon: Icon,
  className,
  size = 16,
  ...props
}: AppIconProps) => {
  return <Icon size={size} className={cn(className)} {...props} />;
};

export default AppIcon;
