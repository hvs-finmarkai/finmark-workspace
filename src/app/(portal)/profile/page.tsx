"use client";

import { useState } from "react";
import { Camera, Edit2, Mail, Phone, MapPin, Shield, Link2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatusType } from "@/types";

const statusColors: Record<StatusType, string> = {
  [StatusType.AVAILABLE]: "bg-emerald-500",
  [StatusType.BUSY]: "bg-red-500",
  [StatusType.AWAY]: "bg-amber-500",
  [StatusType.MEETING]: "bg-blue-500",
  [StatusType.DO_NOT_DISTURB]: "bg-rose-600",
  [StatusType.OFFLINE]: "bg-gray-400",
};

const mockProfile = {
  name: "Arjun Mehta",
  email: "arjun.mehta@finmark.ai",
  designation: "Senior Software Engineer",
  department: "Engineering",
  phone: "+91 98765 43210",
  image: null as string | null,
  about: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Currently focused on React, Next.js, and cloud-native architecture.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker", "GraphQL"],
  status: StatusType.AVAILABLE,
  statusMessage: "Working on sprint tasks",
  socialLinks: {
    github: "github.com/arjunmehta",
    linkedin: "linkedin.com/in/arjunmehta",
    twitter: "",
  },
  googleConnected: true,
  passwordEnabled: true,
};

export default function ProfilePage() {
  const [profile] = useState(mockProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    phone: profile.phone,
    about: profile.about,
    designation: profile.designation,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Manage your personal information and settings</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar size="xl" className="h-24 w-24">
                {profile.image ? (
                  <AvatarImage src={profile.image} alt={profile.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                )}
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-[hsl(var(--muted-foreground))]">{profile.designation}</p>
                  <Badge variant="secondary" className="mt-1">{profile.department}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${statusColors[profile.status]}`} />
                <span className="text-sm font-medium">Available</span>
                {profile.statusMessage && (
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">— {profile.statusMessage}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <span className="text-sm">{profile.department} Department</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.socialLinks.github && (
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm">{profile.socialLinks.github}</span>
              </div>
            )}
            {profile.socialLinks.linkedin && (
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm">{profile.socialLinks.linkedin}</span>
              </div>
            )}
            {!profile.socialLinks.github && !profile.socialLinks.linkedin && (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">No social links added</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{profile.about}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Google Account</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Sign in with Google</p>
            </div>
            <Badge variant={profile.googleConnected ? "success" : "secondary"}>
              {profile.googleConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Password Login</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Use email and password to sign in</p>
            </div>
            <Badge variant={profile.passwordEnabled ? "success" : "secondary"}>
              {profile.passwordEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Change Password</Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Remove Password</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
            <div className="relative z-50 w-full max-w-lg rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
              <button className="absolute right-4 top-4 opacity-70 hover:opacity-100" onClick={() => setEditOpen(false)}>
                <X className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Designation</label>
                  <Input value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">About</label>
                  <textarea
                    value={editForm.about}
                    onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                    rows={3}
                    className="flex w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button onClick={() => setEditOpen(false)}>Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
