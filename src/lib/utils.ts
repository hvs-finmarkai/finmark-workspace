import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StatusType, UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getStatusColor(status: StatusType): string {
  const colors: Record<StatusType, string> = {
    [StatusType.AVAILABLE]: "bg-green-500",
    [StatusType.BUSY]: "bg-red-500",
    [StatusType.AWAY]: "bg-yellow-500",
    [StatusType.MEETING]: "bg-purple-500",
    [StatusType.DO_NOT_DISTURB]: "bg-rose-600",
    [StatusType.OFFLINE]: "bg-gray-400",
  };
  return colors[status];
}

export function getStatusIcon(status: StatusType): string {
  const icons: Record<StatusType, string> = {
    [StatusType.AVAILABLE]: "🟢",
    [StatusType.BUSY]: "🔴",
    [StatusType.AWAY]: "🟡",
    [StatusType.MEETING]: "🟣",
    [StatusType.DO_NOT_DISTURB]: "⛔",
    [StatusType.OFFLINE]: "⚫",
  };
  return icons[status];
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "Super Admin",
    [UserRole.ADMIN]: "Admin",
    [UserRole.MANAGER]: "Manager",
    [UserRole.EMPLOYEE]: "Employee",
    [UserRole.HR]: "HR",
  };
  return labels[role];
}
