"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CircleDollarSign,
  FolderKanban,
  GraduationCap,
  Grid2X2,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Tags,
  UserCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";

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
      href: "/admin/courses",
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
      href: "/admin/instructors",
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
      href: "/instructor/my-courses",
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
      href: "/student/my-learning",
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

const AppLayoutShell = ({ role, children }: AppLayoutShellProps) => {
  const pathname = usePathname();
  const navigation = navigationByRole[role];
  const meta = roleMeta[role];

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <Sidebar
          collapsible="icon"
          variant="inset"
          className="bg-white border border-r-[1px]"
        >
          <SidebarHeader className="gap-4 px-3 py-4 bg-white">
            <Link
              href={navigation[0].href}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl text-sm font-semibold",
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
                <SidebarMenu>
                  {navigation.map((item) => {
                    const active = isRouteActive(pathname, item.href);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className={cn(
                            "rounded-md transition-all",
                            active && [
                              "bg-primary text-primary-foreground hover:bg-primary/90",
                              "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                            ],
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon
                              className={cn(
                                "transition-colors",
                                active && "text-primary-foreground",
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
                                    "rounded-md",
                                    isRouteActive(pathname, subItem.href) && [
                                      "bg-primary text-primary-foreground hover:bg-primary/90",
                                      "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                                    ],
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

          <SidebarFooter className="px-3 py-4 bg-white">
            <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/35 p-3">
              <Avatar className="border border-sidebar-border">
                <AvatarFallback>{meta.shortLabel}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="truncate text-sm font-medium">{meta.label}</div>
                <div className="truncate text-xs text-sidebar-foreground/70">
                  Layout shell ready
                </div>
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-h-screen bg-stone-100/70 w-full min-w-0 overflow-x-hidden">
          <header className="sticky top-0 z-20 border-b  bg-white backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
              <SidebarTrigger className="rounded-xl border border-primary bg-white hover:bg-slate-100 text-primary" />

              <div>
                <div className="h-12.5 w-12.5 bg-stone-200 rounded-full">
                  <AvatarBadge />
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col min-w-0 w-full">
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
