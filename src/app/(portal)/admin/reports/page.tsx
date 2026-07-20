"use client";

import { useState } from "react";
import { Download, FileText, BarChart3, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const departmentData = [
  { name: "Engineering", count: 14, color: "#9333ea" },
  { name: "Sales", count: 8, color: "#10b981" },
  { name: "Marketing", count: 6, color: "#f59e0b" },
  { name: "Finance", count: 5, color: "#3b82f6" },
  { name: "HR", count: 4, color: "#ef4444" },
  { name: "Design", count: 4, color: "#8b5cf6" },
];

const activityData = [
  { day: "Mon", logins: 42, actions: 156 },
  { day: "Tue", logins: 45, actions: 178 },
  { day: "Wed", logins: 40, actions: 145 },
  { day: "Thu", logins: 44, actions: 190 },
  { day: "Fri", logins: 38, actions: 134 },
  { day: "Sat", logins: 12, actions: 45 },
  { day: "Sun", logins: 8, actions: 22 },
];

const maxCount = Math.max(...departmentData.map(d => d.count));
const maxLogins = Math.max(...activityData.map(d => d.logins));
const maxActions = Math.max(...activityData.map(d => d.actions));

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");

  const handleExport = (format: "csv" | "pdf") => {
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Generate and export organizational reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["daily", "weekly", "monthly"] as const).map((type) => (
          <Button
            key={type}
            variant={reportType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setReportType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-base">Employee Status Report</CardTitle>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{reportType} overview</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Active</span>
                <Badge variant="success">40</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Online</span>
                <Badge variant="info">32</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak Hour</span>
                <span className="text-sm font-medium">10:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Working Hours</span>
                <span className="text-sm font-medium">8.2 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Late Logins</span>
                <Badge variant="warning">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">Department Report</CardTitle>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Team distribution & performance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Largest Team</span>
                <span className="text-sm font-medium">Engineering (14)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Smallest Team</span>
                <span className="text-sm font-medium">HR (4)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Team Size</span>
                <span className="text-sm font-medium">6.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Hires (Month)</span>
                <Badge variant="success">+4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Open Positions</span>
                <Badge variant="info">7</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[hsl(var(--primary))]" />
            <CardTitle>Department Sizes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="text-sm w-24 shrink-0">{dept.name}</span>
                <div className="flex-1 h-8 rounded-lg bg-[hsl(var(--secondary))] overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                    style={{ width: `${(dept.count / maxCount) * 100}%`, backgroundColor: dept.color }}
                  >
                    <span className="text-xs font-medium text-white">{dept.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[hsl(var(--primary))]" />
            <CardTitle>Activity Over Time</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-48">
            {activityData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-[hsl(var(--primary))]/80"
                    style={{ height: `${(item.logins / maxLogins) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[hsl(var(--primary))]/80" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Logins</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
