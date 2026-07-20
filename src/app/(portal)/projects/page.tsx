"use client";

import { useState } from "react";
import { FolderKanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectStatus } from "@/types";

const statusConfig: Record<ProjectStatus, { label: string; variant: "success" | "info" | "warning" }> = {
  [ProjectStatus.ACTIVE]: { label: "Active", variant: "success" },
  [ProjectStatus.COMPLETED]: { label: "Completed", variant: "info" },
  [ProjectStatus.ON_HOLD]: { label: "On Hold", variant: "warning" },
};

const mockProjects = [
  {
    id: "1",
    name: "Finmark Workspace v2",
    description: "Complete redesign and rebuild of the internal employee management platform with modern UI and new features.",
    status: ProjectStatus.ACTIVE,
    progress: 65,
    members: [
      { name: "Arjun Mehta", initials: "AM" },
      { name: "Priya Sharma", initials: "PS" },
      { name: "Meera Reddy", initials: "MR" },
      { name: "Rahul Verma", initials: "RV" },
    ],
  },
  {
    id: "2",
    name: "Client Portal",
    description: "External-facing portal for clients to track project progress and communicate with teams.",
    status: ProjectStatus.ACTIVE,
    progress: 40,
    members: [
      { name: "Arjun Mehta", initials: "AM" },
      { name: "Ananya Gupta", initials: "AG" },
    ],
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    description: "Real-time analytics and reporting dashboard for business metrics and team performance.",
    status: ProjectStatus.COMPLETED,
    progress: 100,
    members: [
      { name: "Arjun Mehta", initials: "AM" },
      { name: "Karan Joshi", initials: "KJ" },
      { name: "Vikram Singh", initials: "VS" },
    ],
  },
  {
    id: "4",
    name: "Mobile App",
    description: "Native mobile application for iOS and Android with push notifications and offline support.",
    status: ProjectStatus.ON_HOLD,
    progress: 20,
    members: [
      { name: "Arjun Mehta", initials: "AM" },
      { name: "Rohit Nair", initials: "RN" },
    ],
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Centralized API gateway with rate limiting, authentication, and monitoring capabilities.",
    status: ProjectStatus.ACTIVE,
    progress: 80,
    members: [
      { name: "Arjun Mehta", initials: "AM" },
      { name: "Meera Reddy", initials: "MR" },
      { name: "Ananya Gupta", initials: "AG" },
    ],
  },
];

const filters = ["All", "Active", "Completed", "On Hold"] as const;
type FilterType = (typeof filters)[number];

const filterToStatus: Record<FilterType, ProjectStatus | null> = {
  All: null,
  Active: ProjectStatus.ACTIVE,
  Completed: ProjectStatus.COMPLETED,
  "On Hold": ProjectStatus.ON_HOLD,
};

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered = activeFilter === "All"
    ? mockProjects
    : mockProjects.filter((p) => p.status === filterToStatus[activeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Projects</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Track your ongoing and completed projects</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Button key={f} variant={activeFilter === f ? "default" : "outline"} size="sm" onClick={() => setActiveFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((project) => {
          const config = statusConfig[project.status];
          return (
            <Card key={project.id} className="hover:border-[hsl(var(--ring))]/50 transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{project.name}</h3>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2 line-clamp-2">{project.description}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[hsl(var(--muted-foreground))]">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member, idx) => (
                      <Avatar key={idx} size="sm" className="border-2 border-[hsl(var(--card))]">
                        <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 4 && (
                      <Avatar size="sm" className="border-2 border-[hsl(var(--card))]">
                        <AvatarFallback className="text-[10px]">+{project.members.length - 4}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{project.members.length} members</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderKanban className="h-16 w-16 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-lg font-medium">No projects found</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No projects match this filter</p>
        </div>
      )}
    </div>
  );
}
