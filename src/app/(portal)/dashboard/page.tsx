"use client";

import { useSession } from "next-auth/react";
import { getGreeting } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/status-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ProjectsCard } from "@/components/dashboard/projects-card";
import { MeetingsCard } from "@/components/dashboard/meetings-card";
import { AnnouncementsCard } from "@/components/dashboard/announcements-card";
import { QuickLinks } from "@/components/dashboard/quick-links";

export default function DashboardPage() {
  const { data: session } = useSession();
  const greeting = getGreeting();
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <StatusCard />
        </div>
      </div>

      <StatsRow />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectsCard />
        <MeetingsCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnnouncementsCard />
        <QuickLinks />
      </div>
    </div>
  );
}
