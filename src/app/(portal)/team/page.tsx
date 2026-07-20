"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusType } from "@/types";

const statusColors: Record<StatusType, string> = {
  [StatusType.AVAILABLE]: "bg-emerald-500",
  [StatusType.BUSY]: "bg-red-500",
  [StatusType.AWAY]: "bg-amber-500",
  [StatusType.MEETING]: "bg-blue-500",
  [StatusType.DO_NOT_DISTURB]: "bg-rose-600",
  [StatusType.OFFLINE]: "bg-gray-400",
};

const statusLabels: Record<StatusType, string> = {
  [StatusType.AVAILABLE]: "Available",
  [StatusType.BUSY]: "Busy",
  [StatusType.AWAY]: "Away",
  [StatusType.MEETING]: "In Meeting",
  [StatusType.DO_NOT_DISTURB]: "Do Not Disturb",
  [StatusType.OFFLINE]: "Offline",
};

const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "HR", "Finance"];
const statuses = ["All", ...Object.values(StatusType)];

const mockMembers = [
  { id: "1", name: "Arjun Mehta", designation: "Senior Engineer", department: "Engineering", image: null, status: StatusType.AVAILABLE, statusMessage: "Working on sprint tasks" },
  { id: "2", name: "Priya Sharma", designation: "UI/UX Designer", department: "Design", image: null, status: StatusType.MEETING, statusMessage: "Design review call" },
  { id: "3", name: "Rahul Verma", designation: "Marketing Lead", department: "Marketing", image: null, status: StatusType.BUSY, statusMessage: "Campaign launch prep" },
  { id: "4", name: "Sneha Patel", designation: "HR Manager", department: "HR", image: null, status: StatusType.AVAILABLE, statusMessage: "Open for chats" },
  { id: "5", name: "Vikram Singh", designation: "Sales Executive", department: "Sales", image: null, status: StatusType.AWAY, statusMessage: "On client visit" },
  { id: "6", name: "Ananya Gupta", designation: "Full Stack Dev", department: "Engineering", image: null, status: StatusType.DO_NOT_DISTURB, statusMessage: "Deep work mode" },
  { id: "7", name: "Karan Joshi", designation: "Finance Analyst", department: "Finance", image: null, status: StatusType.OFFLINE, statusMessage: "" },
  { id: "8", name: "Meera Reddy", designation: "Product Manager", department: "Engineering", image: null, status: StatusType.AVAILABLE, statusMessage: "Planning next sprint" },
  { id: "9", name: "Rohit Nair", designation: "Content Writer", department: "Marketing", image: null, status: StatusType.BUSY, statusMessage: "Writing blog posts" },
];

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "All" || m.department === department;
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Directory</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Find and connect with your colleagues</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search by name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Status" : statusLabels[s as StatusType]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <Card key={member.id} className="cursor-pointer hover:border-[hsl(var(--ring))]/50 transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar size="lg">
                  {member.image ? (
                    <AvatarImage src={member.image} alt={member.name} />
                  ) : (
                    <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{member.name}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] truncate">{member.designation}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{member.department}</Badge>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[member.status]}`} />
                <span className="text-sm font-medium">{statusLabels[member.status]}</span>
              </div>
              {member.statusMessage && (
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] truncate">{member.statusMessage}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-lg font-medium">No team members found</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
