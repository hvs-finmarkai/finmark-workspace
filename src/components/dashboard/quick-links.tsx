"use client";

import Link from "next/link";
import { Users, User, CalendarOff, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickLinks = [
  { label: "Team Directory", href: "/team", icon: Users, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { label: "My Profile", href: "/profile", icon: User, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { label: "Leave Request", href: "/leave", icon: CalendarOff, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { label: "Help Desk", href: "/help", icon: HelpCircle, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-[hsl(var(--border))] p-4 transition-colors hover:bg-[hsl(var(--accent))]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.color}`}>
                <link.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-[hsl(var(--foreground))]">{link.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
