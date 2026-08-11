import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo = ({ className, light = false }: LogoProps) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2 w-fit", className)}>
      <div
        className={cn(
          "p-1.5 rounded-lg",
          light ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
        )}
      >
        <GraduationCap className="h-5 w-5" />
      </div>
      <span
        className={cn(
          "text-2xl font-black",
          light
            ? "text-white"
            : "bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
        )}
      >
        zAcademy
      </span>
    </Link>
  );
};

export default Logo;
