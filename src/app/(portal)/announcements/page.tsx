"use client";

import { useState } from "react";
import { Pin, ChevronDown, ChevronUp, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Priority } from "@/types";

const priorityConfig: Record<Priority, { label: string; variant: "info" | "warning" | "danger" }> = {
  [Priority.NORMAL]: { label: "Normal", variant: "info" },
  [Priority.IMPORTANT]: { label: "Important", variant: "warning" },
  [Priority.CRITICAL]: { label: "Critical", variant: "danger" },
};

const mockAnnouncements = [
  {
    id: "1",
    title: "System Maintenance Scheduled",
    content: "The platform will undergo scheduled maintenance on Saturday, July 25th from 2:00 AM to 6:00 AM IST. Please save all your work before this time. All services will be temporarily unavailable during this window. We apologize for any inconvenience caused.",
    priority: Priority.CRITICAL,
    pinned: true,
    createdBy: { name: "Admin Team", initials: "AT" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "2",
    title: "New Leave Policy Update",
    content: "Starting next month, the company will introduce flexible leave policies. Employees can now carry forward up to 10 days of unused leave to the next quarter. Please review the updated HR handbook for complete details on the new leave categories and approval workflows.",
    priority: Priority.IMPORTANT,
    pinned: true,
    createdBy: { name: "Sneha Patel", initials: "SP" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "3",
    title: "Welcome New Team Members",
    content: "We're excited to welcome three new members to our team this week! Please join us in welcoming Rohit from Engineering, Ananya from Design, and Karan from Finance. Let's make them feel at home!",
    priority: Priority.NORMAL,
    pinned: false,
    createdBy: { name: "HR Department", initials: "HR" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "4",
    title: "Q3 Goals Published",
    content: "The quarterly goals and OKRs for Q3 have been published. Each team lead will schedule alignment meetings this week. Please review your team's objectives and prepare any questions for the discussion sessions.",
    priority: Priority.NORMAL,
    pinned: false,
    createdBy: { name: "Vikram Singh", initials: "VS" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: "5",
    title: "Office Renovation Notice",
    content: "The 3rd floor will be undergoing renovation starting next week. Teams on this floor will be temporarily relocated to the 5th floor. Please coordinate with your managers for seating arrangements. The renovation is expected to be completed within two weeks.",
    priority: Priority.IMPORTANT,
    pinned: false,
    createdBy: { name: "Facilities", initials: "FC" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AnnouncementsPage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pinned = mockAnnouncements.filter((a) => a.pinned);
  const regular = mockAnnouncements.filter((a) => !a.pinned);
  const sorted = [...pinned, ...regular];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Company updates and important notices</p>
      </div>

      <div className="space-y-4">
        {sorted.map((announcement) => {
          const isExpanded = expandedIds.has(announcement.id);
          const config = priorityConfig[announcement.priority];
          const contentPreview = announcement.content.length > 120 ? announcement.content.slice(0, 120) + "..." : announcement.content;

          return (
            <Card key={announcement.id} className={`transition-all duration-200 ${announcement.pinned ? "border-[hsl(var(--ring))]/20" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {announcement.pinned && (
                      <Pin className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed">
                        {isExpanded ? announcement.content : contentPreview}
                      </p>
                      {announcement.content.length > 120 && (
                        <button
                          onClick={() => toggleExpand(announcement.id)}
                          className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] mt-2 hover:underline font-medium"
                        >
                          {isExpanded ? (
                            <>Show less <ChevronUp className="h-3 w-3" /></>
                          ) : (
                            <>Read more <ChevronDown className="h-3 w-3" /></>
                          )}
                        </button>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">{announcement.createdBy.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">{announcement.createdBy.name}</span>
                        </div>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">•</span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">{formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <Megaphone className="h-16 w-16 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-lg font-medium">No announcements</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}
