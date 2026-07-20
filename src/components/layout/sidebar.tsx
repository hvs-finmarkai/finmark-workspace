"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  User,
  Bell,
  Megaphone,
  FolderKanban,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

interface SidebarProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: boolean;
}

const employeeNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Team Directory", href: "/team", icon: Users },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: true },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "My Projects", href: "/projects", icon: FolderKanban },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Employees", href: "/admin/employees", icon: UserCog },
  { label: "Departments", href: "/admin/departments", icon: Users },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Roles & Permissions", href: "/admin/roles", icon: Shield },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Activity Logs", href: "/admin/activity", icon: FolderKanban },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[hsl(var(--card))] p-2 shadow-md lg:hidden"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--border))] transition-transform duration-300 lg:relative lg:translate-x-0",
          collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <span className="text-lg font-bold text-[hsl(var(--sidebar-foreground))]">
            Finmark
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-purple-600 dark:text-purple-400")} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[hsl(var(--border))] p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
