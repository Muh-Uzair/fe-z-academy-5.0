"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/utils/cn";
import Logo from "@/components/Logo";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PublicNavbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      {/* Left: Logo */}
      <Logo />

      {/* Middle: Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "relative py-2 transition-all duration-300 hover:text-primary",
            isActive("/") ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:rounded-full" : "text-muted-foreground"
          )}
        >
          Home
        </Link>
        <Link
          href="/courses"
          className={cn(
            "relative py-2 transition-all duration-300 hover:text-primary",
            isActive("/courses") ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:rounded-full" : "text-muted-foreground"
          )}
        >
          Courses
        </Link>
        <Link
          href="/about-us"
          className={cn(
            "relative py-2 transition-all duration-300 hover:text-primary",
            isActive("/about-us") ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:rounded-full" : "text-muted-foreground"
          )}
        >
          About Us
        </Link>
      </div>

      {/* Right: Auth & Mobile Menu */}
      <div className="flex items-center gap-3">
        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin">
            <Button variant="ghost" className="hover:text-primary hover:bg-primary/10 transition-colors">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/" className={cn("w-full cursor-pointer", isActive("/") && "bg-primary/10 text-primary font-bold")}>Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses" className={cn("w-full cursor-pointer", isActive("/courses") && "bg-primary/10 text-primary font-bold")}>Courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about-us" className={cn("w-full cursor-pointer", isActive("/about-us") && "bg-primary/10 text-primary font-bold")}>About Us</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/signin" className="w-full cursor-pointer">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup" className="w-full cursor-pointer font-bold text-primary">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
