"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Pin, PinOff, Calendar, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const initialAnnouncements = [
  { id: "1", title: "System Maintenance Scheduled", content: "The platform will undergo maintenance on Saturday from 2 AM to 6 AM IST. Please save your work before the maintenance window.", priority: "CRITICAL", pinned: true, scheduledAt: null, createdAt: "2026-07-18T10:00:00" },
  { id: "2", title: "New Leave Policy Update", content: "We have updated our leave policy effective August 1st. Please review the updated HR handbook for details on the new casual leave allocation.", priority: "IMPORTANT", pinned: true, scheduledAt: null, createdAt: "2026-07-17T14:30:00" },
  { id: "3", title: "Friday Team Lunch", content: "Join us for a team lunch this Friday at 1 PM in the cafeteria. All departments welcome!", priority: "NORMAL", pinned: false, scheduledAt: "2026-07-25T13:00:00", createdAt: "2026-07-16T09:00:00" },
  { id: "4", title: "Q3 Goals Submission Deadline", content: "Please submit your Q3 goals and KPIs by end of this week. Use the Goals portal in your dashboard.", priority: "IMPORTANT", pinned: false, scheduledAt: null, createdAt: "2026-07-15T11:00:00" },
  { id: "5", title: "Welcome New Joiners", content: "Please welcome our new team members joining this week in Engineering and Marketing departments.", priority: "NORMAL", pinned: false, scheduledAt: null, createdAt: "2026-07-14T08:00:00" },
];

const priorityConfig: Record<string, { variant: any; icon: any; label: string }> = {
  CRITICAL: { variant: "danger", icon: AlertCircle, label: "Critical" },
  IMPORTANT: { variant: "warning", icon: AlertTriangle, label: "Important" },
  NORMAL: { variant: "info", icon: Info, label: "Normal" },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [pinned, setPinned] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPriority("NORMAL");
    setPinned(false);
    setScheduled(false);
    setScheduleDate("");
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!title || !content) return;
    if (editId) {
      setAnnouncements(announcements.map((a) =>
        a.id === editId ? { ...a, title, content, priority, pinned, scheduledAt: scheduled ? scheduleDate : null } : a
      ));
    } else {
      setAnnouncements([{
        id: String(Date.now()),
        title,
        content,
        priority,
        pinned,
        scheduledAt: scheduled ? scheduleDate : null,
        createdAt: new Date().toISOString(),
      }, ...announcements]);
    }
    resetForm();
  };

  const handleEdit = (announcement: typeof initialAnnouncements[0]) => {
    setEditId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setPriority(announcement.priority);
    setPinned(announcement.pinned);
    setScheduled(!!announcement.scheduledAt);
    setScheduleDate(announcement.scheduledAt || "");
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAnnouncements(announcements.filter((a) => a.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Create and manage company announcements</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement content..."
                rows={4}
                className="flex w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  <option value="NORMAL">Normal</option>
                  <option value="IMPORTANT">Important</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))]" />
                  <span className="text-sm font-medium">Pin Announcement</span>
                </label>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))]" />
                  <span className="text-sm font-medium">Schedule</span>
                </label>
              </div>
            </div>
            {scheduled && (
              <div>
                <label className="text-sm font-medium">Schedule Date & Time</label>
                <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>{editId ? "Update" : "Publish"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {announcements.map((announcement) => {
          const config = priorityConfig[announcement.priority];
          const Icon = config.icon;
          return (
            <Card key={announcement.id} className={`${announcement.pinned ? "border-[hsl(var(--ring))]/30" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Badge variant={config.variant}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      {announcement.pinned && (
                        <Badge variant="secondary">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {announcement.scheduledAt && (
                        <Badge variant="info">
                          <Calendar className="h-3 w-3 mr-1" />
                          Scheduled
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">{announcement.content}</p>
                    <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      Created: {formatDate(announcement.createdAt)}
                      {announcement.scheduledAt && ` • Scheduled for: ${formatDate(announcement.scheduledAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePin(announcement.id)}>
                      {announcement.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(announcement)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteTarget(announcement.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Delete Announcement</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Are you sure you want to delete this announcement? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
