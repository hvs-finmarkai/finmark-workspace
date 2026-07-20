"use client";

import { Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  link?: string;
}

interface MeetingsCardProps {
  meetings?: Meeting[];
}

const defaultMeetings: Meeting[] = [
  { id: "1", title: "Sprint Planning", time: "10:00 AM", duration: "45 min", link: "#" },
  { id: "2", title: "Design Review", time: "2:00 PM", duration: "30 min", link: "#" },
  { id: "3", title: "Team Standup", time: "4:30 PM", duration: "15 min", link: "#" },
];

export function MeetingsCard({ meetings = defaultMeetings }: MeetingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming Meetings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/10">
                <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{meeting.title}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {meeting.time} · {meeting.duration}
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              Join
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
