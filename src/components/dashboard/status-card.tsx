"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusType } from "@/types";
import { getStatusColor, cn } from "@/lib/utils";

interface StatusCardProps {
  currentStatus?: StatusType;
  statusMessage?: string;
}

const statusOptions = [
  { value: StatusType.AVAILABLE, label: "Available" },
  { value: StatusType.BUSY, label: "Busy" },
  { value: StatusType.AWAY, label: "Away" },
  { value: StatusType.MEETING, label: "Meeting" },
  { value: StatusType.DO_NOT_DISTURB, label: "Do Not Disturb" },
  { value: StatusType.OFFLINE, label: "Offline" },
];

export function StatusCard({ currentStatus = StatusType.AVAILABLE, statusMessage = "" }: StatusCardProps) {
  const [status, setStatus] = useState<StatusType>(currentStatus);
  const [message, setMessage] = useState(statusMessage);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: StatusType) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch("/api/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, statusMessage: message }),
      });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleMessageUpdate = async () => {
    setSaving(true);
    try {
      await fetch("/api/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusMessage: message }),
      });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const currentOption = statusOptions.find((o) => o.value === status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full", getStatusColor(status))} />
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as StatusType)}
            className="flex-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="What's your status?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={handleMessageUpdate}
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        {saving && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Saving...</p>
        )}
      </CardContent>
    </Card>
  );
}
