"use client";

import { useState } from "react";
import { Bell, CheckCheck, MessageSquare, UserPlus, AlertTriangle, Calendar, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon: "bell" | "message" | "user" | "alert" | "calendar";
  read: boolean;
  createdAt: Date;
}

const iconMap = {
  bell: Bell,
  message: MessageSquare,
  user: UserPlus,
  alert: AlertTriangle,
  calendar: Calendar,
};

const mockNotifications: NotificationItem[] = [
  { id: "1", title: "New Announcement", message: "A critical announcement has been posted by the admin team.", icon: "alert", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
  { id: "2", title: "Team Meeting", message: "Sprint planning meeting scheduled for tomorrow at 10:00 AM.", icon: "calendar", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "3", title: "New Team Member", message: "Meera Reddy has joined the Engineering team.", icon: "user", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "4", title: "Project Update", message: "Project 'Finmark v2' status changed to Active.", icon: "bell", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "5", title: "Message from Priya", message: "Hey, can you review the design mockups when you get a chance?", icon: "message", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "6", title: "Password Changed", message: "Your password was successfully updated.", icon: "bell", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-[hsl(var(--muted-foreground))]">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
          Unread ({unreadCount})
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((notification) => {
          const Icon = iconMap[notification.icon];
          return (
            <Card key={notification.id} className={`transition-all duration-200 ${!notification.read ? "border-[hsl(var(--ring))]/30 bg-[hsl(var(--accent))]/30" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${!notification.read ? "gradient-primary" : "bg-[hsl(var(--secondary))]"}`}>
                    <Icon className={`h-5 w-5 ${!notification.read ? "text-white" : "text-[hsl(var(--muted-foreground))]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>{notification.title}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">{timeAgo(notification.createdAt)}</span>
                        {!notification.read && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" />
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Inbox className="h-16 w-16 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-lg font-medium">No notifications</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {filter === "unread" ? "You're all caught up!" : "Nothing here yet"}
          </p>
        </div>
      )}
    </div>
  );
}
