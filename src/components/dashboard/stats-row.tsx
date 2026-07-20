"use client";

import { useState, useEffect } from "react";
import { Clock, Timer, Users, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";

interface StatsRowProps {
  loginTime?: string;
  teamCount?: number;
  meetingsCount?: number;
}

export function StatsRow({ loginTime, teamCount = 24, meetingsCount = 3 }: StatsRowProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Clock,
      label: "Current Time",
      value: currentTime ? currentTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) : "--:--:--",
      sublabel: currentTime ? currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }) : "",
    },
    {
      icon: Timer,
      label: "Working Since",
      value: loginTime ? formatTime(loginTime) : "9:00 AM",
      sublabel: "Today",
    },
    {
      icon: Users,
      label: "Team Members",
      value: teamCount.toString(),
      sublabel: "Active now",
    },
    {
      icon: Video,
      label: "Upcoming Meetings",
      value: meetingsCount.toString(),
      sublabel: "Today",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/10">
                <stat.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                <p className="text-lg font-semibold text-[hsl(var(--foreground))]">{stat.value}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.sublabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
