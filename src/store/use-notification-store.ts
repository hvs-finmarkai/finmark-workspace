import { create } from "zustand";
import { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const notifications: Notification[] = await res.json();
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      });
    }
  },
  markAsRead: async (id) => {
    const res = await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });

    if (res.ok) {
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      });
    }
  },
  markAllAsRead: async () => {
    const res = await fetch("/api/notifications/read-all", {
      method: "PATCH",
    });

    if (res.ok) {
      const notifications = get().notifications.map((n) => ({
        ...n,
        read: true,
      }));
      set({ notifications, unreadCount: 0 });
    }
  },
}));
