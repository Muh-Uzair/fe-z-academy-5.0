"use client";

import { useEffect } from "react";
import type { AuthUser } from "@/response-types/authResponseTypes";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Grid2X2,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Star,
  Tags,
  UserCheck,
  Users,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { signoutAction } from "@/services/auth/actions";
import useClientAction from "@/hooks/useClientAction";

type AppRole = "admin" | "instructor" | "student";

type NavigationItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: Array<{
    title: string;
    href: string;
  }>;
};

type AppLayoutShellProps = {
  role: AppRole;
  user: AuthUser;
  children: React.ReactNode;
};

const navigationByRole: Record<AppRole, NavigationItem[]> = {
  admin: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      href: "/admin/courses/all-courses",
      icon: BookOpen,
      items: [
        { title: "All Courses", href: "/admin/courses/all-courses" },
        {
          title: "Pending Verification",
          href: "/admin/courses/pending-verification-courses",
        },
        { title: "Verified Courses", href: "/admin/courses/verified-courses" },
      ],
    },
    {
      title: "Instructors",
      href: "/admin/instructors/all-instructors",
      icon: UserCheck,
      items: [
        {
          title: "All Instructors",
          href: "/admin/instructors/all-instructors",
        },
        {
          title: "Pending Verifications",
          href: "/admin/instructors/pending-verifications",
        },
      ],
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: Users,
    },
    {
      title: "Enrollments",
      href: "/admin/enrollments",
      icon: Grid2X2,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Tags,
    },
    {
      title: "Chat",
      href: "/admin/chat",
      icon: MessageSquare,
    },
    {
      title: "Reviews",
      href: "/admin/reviews",
      icon: Star,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
  instructor: [
    {
      title: "Dashboard",
      href: "/instructor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/instructor/my-courses/all-my-courses",
      icon: FolderKanban,
      items: [
        {
          title: "All My Courses",
          href: "/instructor/my-courses/all-my-courses",
        },
        {
          title: "Create New Course",
          href: "/instructor/my-courses/create-new-courses",
        },
        {
          title: "Pending Verifications",
          href: "/instructor/my-courses/pending-verifications",
        },
      ],
    },
    {
      title: "My Students",
      href: "/instructor/my-students",
      icon: Users,
    },
    {
      title: "Enrollments",
      href: "/instructor/enrollments",
      icon: Grid2X2,
    },
    {
      title: "Chat",
      href: "/instructor/chat",
      icon: MessageSquare,
    },
    {
      title: "Reviews",
      href: "/instructor/reviews",
      icon: Star,
    },
    {
      title: "Settings",
      href: "/instructor/settings",
      icon: Settings,
    },
  ],
  student: [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Browse Courses",
      href: "/student/browse-courses",
      icon: Search,
    },
    {
      title: "My Learning",
      href: "/student/my-learning/enrolled-courses",
      icon: GraduationCap,
      items: [
        {
          title: "Enrolled Courses",
          href: "/student/my-learning/enrolled-courses",
        },
        {
          title: "Continue Watching",
          href: "/student/my-learning/continue-watching",
        },
      ],
    },
    {
      title: "Chat",
      href: "/student/chat",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/student/settings",
      icon: Settings,
    },
  ],
};

const roleMeta: Record<
  AppRole,
  { label: string; shortLabel: string; summary: string; accent: string }
> = {
  admin: {
    label: "Admin Workspace",
    shortLabel: "AD",
    summary: "Platform controls, approvals, and operational views.",
    accent: "bg-[#14b8a6] text-white",
  },
  instructor: {
    label: "Instructor Workspace",
    shortLabel: "IN",
    summary: "Course creation, learners, and teaching operations.",
    accent: "bg-[#14b8a6] text-white",
  },
  student: {
    label: "Student Workspace",
    shortLabel: "ST",
    summary: "Learning progress, discovery, and student tools.",
    accent: "bg-[#14b8a6] text-white",
  },
};

const isRouteActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const AppLayoutShell = ({ role, user, children }: AppLayoutShellProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = navigationByRole[role];
  const meta = roleMeta[role];
  const { run: runSignoutAction, isLoading: isSignoutLoading } =
    useClientAction();

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]);

  const handleSignout = async () => {
    const response = await runSignoutAction(() => signoutAction());

    if (response && response.status === "success") {
      localStorage.removeItem("currentUser");
      router.push("/signin");
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <Sidebar
          collapsible="icon"
          className="bg-white border-r border-sidebar-border"
        >
          <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 bg-white">
            <Link
              href={navigation[0].href}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold",
                  meta.accent,
                )}
              >
                ZA
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="truncate text-sm font-semibold text-primary">
                  Z Academy 5.0
                </div>
                <div className="truncate text-xs text-sidebar-foreground/70">
                  {meta.label}
                </div>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {navigation.map((item) => {
                    const active = isRouteActive(pathname, item.href);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            "rounded-md transition-all px-4 gap-3",
                            active
                              ? [
                                  "bg-primary-very-light text-primary hover:bg-primary-very-light/90",
                                  "data-[active=true]:bg-primary-very-light data-[active=true]:text-primary",
                                  "py-2 h-auto",
                                ]
                              : "text-muted-foreground py-2 h-auto hover:text-foreground hover:bg-sidebar-accent",
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon
                              className={cn(
                                "transition-colors",
                                active
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.items?.length ? (
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isRouteActive(
                                    pathname,
                                    subItem.href,
                                  )}
                                  className={cn(
                                    "rounded-md transition-all px-4",
                                    isRouteActive(pathname, subItem.href)
                                      ? [
                                          "bg-primary-very-light text-primary hover:bg-primary-very-light/90",
                                          "data-[active=true]:bg-primary-very-light data-[active=true]:text-primary",
                                          "py-2 h-auto",
                                        ]
                                      : "text-muted-foreground py-2 h-auto hover:text-foreground hover:bg-sidebar-accent",
                                  )}
                                >
                                  <Link href={subItem.href}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 bg-white">
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-sidebar-border bg-sidebar-accent/35 p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center">
              <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:justify-center">
                <Avatar className="border border-sidebar-border shrink-0">
                  <AvatarFallback>{meta.shortLabel}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="truncate text-sm font-medium">
                    {meta.label}
                  </div>
                  <div className="truncate text-xs text-sidebar-foreground/70">
                    Sign out here
                  </div>
                </div>
              </div>
              <button
                onClick={handleSignout}
                disabled={isSignoutLoading}
                className={cn(
                  "p-2 shrink-0 rounded-xl transition-colors group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center",
                  isSignoutLoading
                    ? "opacity-50 cursor-not-allowed text-muted-foreground"
                    : "text-muted-foreground hover:text-red-600 hover:bg-red-50",
                )}
                title="Sign out"
              >
                <LogOut
                  className={cn("size-5", isSignoutLoading && "animate-pulse")}
                />
              </button>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="h-svh bg-stone-100/70 w-full min-w-0 overflow-hidden flex flex-col">
          <header className="shrink-0 z-20 border-b bg-white backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
              <SidebarTrigger className="rounded-xl border border-primary bg-white hover:bg-primary-very-light hover:text-primary text-primary" />

              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {/* Unread badge */}
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-shadow hover:ring-primary/50">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=47"
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                    {meta.shortLabel}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col min-w-0 w-full overflow-y-auto overflow-x-hidden">
            <main className="flex-1 p-4 sm:p-6 min-w-0 w-full">
              <div className="h-full min-w-0">{children}</div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AppLayoutShell;
