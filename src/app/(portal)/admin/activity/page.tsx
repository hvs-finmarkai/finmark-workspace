"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, LogIn, LogOut, RefreshCw, UserCog, Megaphone, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const actionConfig: Record<string, { variant: any; icon: any; label: string }> = {
  Login: { variant: "success", icon: LogIn, label: "Login" },
  Logout: { variant: "secondary", icon: LogOut, label: "Logout" },
  "Status Changed": { variant: "info", icon: RefreshCw, label: "Status Changed" },
  "Profile Updated": { variant: "warning", icon: UserCog, label: "Profile Updated" },
  "Announcement Created": { variant: "default", icon: Megaphone, label: "Announcement Created" },
  "Role Changed": { variant: "danger", icon: Shield, label: "Role Changed" },
};

const mockLogs = [
  { id: "1", user: "Arjun Mehta", action: "Login", details: "Logged in via Google OAuth", timestamp: "2026-07-20T09:00:12" },
  { id: "2", user: "Priya Sharma", action: "Status Changed", details: "Changed status to In Meeting", timestamp: "2026-07-20T09:15:34" },
  { id: "3", user: "Rahul Verma", action: "Announcement Created", details: "Created announcement: Q3 Goals Deadline", timestamp: "2026-07-20T09:20:00" },
  { id: "4", user: "Sneha Patel", action: "Profile Updated", details: "Updated phone number and designation", timestamp: "2026-07-20T09:30:45" },
  { id: "5", user: "Admin", action: "Role Changed", details: "Changed Meera Reddy role from Employee to Manager", timestamp: "2026-07-20T09:45:00" },
  { id: "6", user: "Vikram Singh", action: "Login", details: "Logged in via password", timestamp: "2026-07-20T10:00:22" },
  { id: "7", user: "Ananya Gupta", action: "Status Changed", details: "Changed status to Do Not Disturb", timestamp: "2026-07-20T10:05:11" },
  { id: "8", user: "Karan Joshi", action: "Logout", details: "Session ended", timestamp: "2026-07-20T10:10:33" },
  { id: "9", user: "Meera Reddy", action: "Login", details: "Logged in via Google OAuth", timestamp: "2026-07-20T10:15:00" },
  { id: "10", user: "Rohit Nair", action: "Profile Updated", details: "Updated profile picture", timestamp: "2026-07-20T10:20:45" },
  { id: "11", user: "Deepa Krishnan", action: "Login", details: "Logged in via password", timestamp: "2026-07-20T10:25:00" },
  { id: "12", user: "Amit Bansal", action: "Status Changed", details: "Changed status to In Meeting", timestamp: "2026-07-20T10:30:00" },
  { id: "13", user: "Kavya Iyer", action: "Login", details: "Logged in via Google OAuth", timestamp: "2026-07-20T10:35:22" },
  { id: "14", user: "Arjun Mehta", action: "Status Changed", details: "Changed status to Busy", timestamp: "2026-07-20T11:00:00" },
  { id: "15", user: "Priya Sharma", action: "Logout", details: "Session ended", timestamp: "2026-07-20T11:30:00" },
  { id: "16", user: "Admin", action: "Announcement Created", details: "Created announcement: System Maintenance", timestamp: "2026-07-20T11:45:00" },
];

const actionTypes = ["All", "Login", "Logout", "Status Changed", "Profile Updated", "Announcement Created", "Role Changed"];
const PAGE_SIZE = 8;

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockLogs.filter((log) => {
    const matchSearch = log.user.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "All" || log.action === actionFilter;
    const matchDateFrom = !dateFrom || new Date(log.timestamp) >= new Date(dateFrom);
    const matchDateTo = !dateTo || new Date(log.timestamp) <= new Date(dateTo + "T23:59:59");
    return matchSearch && matchAction && matchDateFrom && matchDateTo;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Track all user actions and system events</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input placeholder="Search by user or details..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))]">
          {actionTypes.map((a) => <option key={a} value={a}>{a === "All" ? "All Actions" : a}</option>)}
        </select>
        <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="w-auto" placeholder="From" />
        <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="w-auto" placeholder="To" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">User</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((log) => {
                  const config = actionConfig[log.action];
                  const Icon = config.icon;
                  return (
                    <tr key={log.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--accent))]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback>{log.user.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={config.variant}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[hsl(var(--muted-foreground))] max-w-xs truncate">{log.details}</td>
                      <td className="py-3 px-4 text-[hsl(var(--muted-foreground))] whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Showing {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
