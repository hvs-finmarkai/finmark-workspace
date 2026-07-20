"use client";

import { useState } from "react";
import { Users, Wifi, WifiOff, Video, Clock, Eye, MessageSquare, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockEmployees = [
  { id: "1", name: "Arjun Mehta", department: "Engineering", status: "AVAILABLE", loginTime: "09:00 AM", lastSeen: "Just now" },
  { id: "2", name: "Priya Sharma", department: "Design", status: "MEETING", loginTime: "09:15 AM", lastSeen: "2 min ago" },
  { id: "3", name: "Rahul Verma", department: "Marketing", status: "BUSY", loginTime: "08:45 AM", lastSeen: "5 min ago" },
  { id: "4", name: "Sneha Patel", department: "HR", status: "AVAILABLE", loginTime: "09:30 AM", lastSeen: "Just now" },
  { id: "5", name: "Vikram Singh", department: "Sales", status: "AWAY", loginTime: "10:00 AM", lastSeen: "15 min ago" },
  { id: "6", name: "Ananya Gupta", department: "Engineering", status: "AVAILABLE", loginTime: "08:30 AM", lastSeen: "Just now" },
  { id: "7", name: "Karan Joshi", department: "Finance", status: "OFFLINE", loginTime: "-", lastSeen: "2 hours ago" },
  { id: "8", name: "Meera Reddy", department: "Engineering", status: "MEETING", loginTime: "09:05 AM", lastSeen: "1 min ago" },
];

const recentActivities = [
  { color: "bg-emerald-500", text: "Arjun Mehta logged in", time: "2 min ago" },
  { color: "bg-blue-500", text: "Priya Sharma joined a meeting", time: "5 min ago" },
  { color: "bg-amber-500", text: "Vikram Singh went away", time: "15 min ago" },
  { color: "bg-red-500", text: "Rahul Verma set status to Busy", time: "20 min ago" },
  { color: "bg-purple-500", text: "New announcement created by Admin", time: "30 min ago" },
  { color: "bg-gray-400", text: "Karan Joshi logged out", time: "2 hours ago" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "AVAILABLE": return "success";
    case "BUSY": return "danger";
    case "MEETING": return "info";
    case "AWAY": return "warning";
    case "OFFLINE": return "secondary";
    default: return "secondary";
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "AVAILABLE": return "Available";
    case "BUSY": return "Busy";
    case "MEETING": return "In Meeting";
    case "AWAY": return "Away";
    case "OFFLINE": return "Offline";
    default: return status;
  }
};

export default function AdminDashboardPage() {
  const totalEmployees = 48;
  const online = 32;
  const offline = 8;
  const inMeeting = 5;
  const away = 3;

  const stats = [
    { icon: Users, value: totalEmployees, label: "Total Employees", sublabel: "+4 this month", color: "from-purple-500 to-purple-700" },
    { icon: Wifi, value: online, label: "Online", sublabel: `${Math.round((online / totalEmployees) * 100)}% of total`, color: "from-emerald-500 to-emerald-700" },
    { icon: WifiOff, value: offline, label: "Offline", sublabel: `${Math.round((offline / totalEmployees) * 100)}% of total`, color: "from-gray-500 to-gray-700" },
    { icon: Video, value: inMeeting, label: "In Meeting", sublabel: `${Math.round((inMeeting / totalEmployees) * 100)}% of total`, color: "from-blue-500 to-blue-700" },
    { icon: Clock, value: away, label: "Away / Busy", sublabel: `${Math.round((away / totalEmployees) * 100)}% of total`, color: "from-amber-500 to-amber-700" },
  ];

  const chartData = [
    { label: "Available", count: 32, color: "#10b981", percent: 67 },
    { label: "Busy", count: 3, color: "#ef4444", percent: 6 },
    { label: "In Meeting", count: 5, color: "#3b82f6", percent: 10 },
    { label: "Away", count: 3, color: "#f59e0b", percent: 6 },
    { label: "Offline", count: 5, color: "#6b7280", percent: 11 },
  ];

  const totalAngle = 360;
  let cumulativeAngle = 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Real-time employee status and overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.sublabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Employee Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))]">
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Login Time</th>
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Last Seen</th>
                      <th className="text-left py-3 px-2 font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEmployees.map((emp) => (
                      <tr key={emp.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--accent))]/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Avatar size="sm">
                              <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">{emp.department}</td>
                        <td className="py-3 px-2">
                          <Badge variant={statusBadgeVariant(emp.status) as any}>{statusLabel(emp.status)}</Badge>
                        </td>
                        <td className="py-3 px-2 text-[hsl(var(--muted-foreground))]">{emp.loginTime}</td>
                        <td className="py-3 px-2 text-[hsl(var(--muted-foreground))]">{emp.lastSeen}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {chartData.map((item, idx) => {
                    const startAngle = cumulativeAngle;
                    const sliceAngle = (item.percent / 100) * totalAngle;
                    cumulativeAngle += sliceAngle;
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((startAngle + sliceAngle - 90) * Math.PI) / 180;
                    const largeArc = sliceAngle > 180 ? 1 : 0;
                    const x1 = 90 + 70 * Math.cos(startRad);
                    const y1 = 90 + 70 * Math.sin(startRad);
                    const x2 = 90 + 70 * Math.cos(endRad);
                    const y2 = 90 + 70 * Math.sin(endRad);
                    const ix1 = 90 + 40 * Math.cos(endRad);
                    const iy1 = 90 + 40 * Math.sin(endRad);
                    const ix2 = 90 + 40 * Math.cos(startRad);
                    const iy2 = 90 + 40 * Math.sin(startRad);
                    return (
                      <path
                        key={idx}
                        d={`M ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 40 40 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
                        fill={item.color}
                        stroke="hsl(var(--card))"
                        strokeWidth="2"
                      />
                    );
                  })}
                  <text x="90" y="85" textAnchor="middle" className="fill-[hsl(var(--foreground))] text-2xl font-bold" fontSize="20">{totalEmployees}</text>
                  <text x="90" y="105" textAnchor="middle" className="fill-[hsl(var(--muted-foreground))]" fontSize="11">Total</text>
                </svg>
              </div>
              <div className="space-y-2">
                {chartData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${activity.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.text}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
