"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "NORMAL" | "IMPORTANT" | "CRITICAL";
  createdAt: string;
}

interface AnnouncementsCardProps {
  announcements?: Announcement[];
}

const defaultAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Office Closure - Independence Day",
    content: "The office will be closed on August 15th for Independence Day celebrations.",
    priority: "IMPORTANT",
    createdAt: "2026-07-19",
  },
  {
    id: "2",
    title: "New Health Insurance Policy",
    content: "Updated health insurance benefits are now available. Please review the changes.",
    priority: "NORMAL",
    createdAt: "2026-07-18",
  },
  {
    id: "3",
    title: "Quarterly Town Hall Meeting",
    content: "Join us this Friday for the Q3 town hall. Agenda includes company updates and Q&A.",
    priority: "NORMAL",
    createdAt: "2026-07-17",
  },
];

const priorityColors = {
  NORMAL: "bg-blue-500",
  IMPORTANT: "bg-amber-500",
  CRITICAL: "bg-red-500",
};

export function AnnouncementsCard({ announcements = defaultAnnouncements }: AnnouncementsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Announcements</CardTitle>
        <Link
          href="/announcements"
          className="text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex gap-3 rounded-lg border border-[hsl(var(--border))] p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600/10">
              <Megaphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {announcement.title}
                </p>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    priorityColors[announcement.priority]
                  )}
                />
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-1">
                {announcement.content}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
