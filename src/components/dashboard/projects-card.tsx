"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
}

interface ProjectsCardProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  { id: "1", name: "Finmark Platform v2", description: "Core platform redesign and feature enhancement", progress: 72 },
  { id: "2", name: "Client Onboarding Flow", description: "Streamline new client onboarding experience", progress: 45 },
  { id: "3", name: "Analytics Dashboard", description: "Real-time analytics and reporting module", progress: 88 },
];

export function ProjectsCard({ projects = defaultProjects }: ProjectsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">My Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{project.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{project.description}</p>
              </div>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {project.progress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  project.progress >= 75
                    ? "bg-green-500"
                    : project.progress >= 50
                    ? "bg-purple-500"
                    : "bg-amber-500"
                )}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
