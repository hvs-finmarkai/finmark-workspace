"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Shield, Bell, Globe, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "gradient-primary" : "bg-[hsl(var(--secondary))]"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

const timezones = [
  "Asia/Kolkata (IST)",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Europe/London (GMT)",
  "Europe/Berlin (CET)",
  "Asia/Tokyo (JST)",
  "Australia/Sydney (AEDT)",
];

const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi"];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    announcements: true,
    projectUpdates: true,
    teamChanges: true,
    messages: true,
    security: true,
  });
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [language, setLanguage] = useState("English");
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordLogin, setPasswordLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<"appearance" | "notifications" | "profile" | "security">("appearance");

  const tabs = [
    { id: "appearance" as const, label: "Appearance", icon: Sun },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "profile" as const, label: "Profile", icon: Globe },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Manage your preferences and account settings</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === "appearance" && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Choose your preferred theme</p>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "light" ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]/50"}`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-xs font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "dark" ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]/50"}`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-xs font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "system" ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]/50"}`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-xs font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Announcements</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Company-wide announcements and updates</p>
              </div>
              <Toggle checked={notifications.announcements} onChange={(v) => setNotifications({ ...notifications, announcements: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Project Updates</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Status changes and milestone completions</p>
              </div>
              <Toggle checked={notifications.projectUpdates} onChange={(v) => setNotifications({ ...notifications, projectUpdates: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Team Changes</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">New members, role changes, departures</p>
              </div>
              <Toggle checked={notifications.teamChanges} onChange={(v) => setNotifications({ ...notifications, teamChanges: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Messages</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Direct messages from team members</p>
              </div>
              <Toggle checked={notifications.messages} onChange={(v) => setNotifications({ ...notifications, messages: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Security Alerts</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Login attempts and password changes</p>
              </div>
              <Toggle checked={notifications.security} onChange={(v) => setNotifications({ ...notifications, security: v })} />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="h-10 w-full max-w-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full max-w-sm rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <Button size="sm">Save Preferences</Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Sign in with Google OAuth</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Password Login</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Enable email/password sign in</p>
                </div>
                <Toggle checked={passwordLogin} onChange={setPasswordLogin} />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Change Password</h4>
                <div className="space-y-3 max-w-sm">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                  <Button size="sm">Update Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--secondary))]">
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Windows • Chrome • Active now</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--secondary))]">
                <div>
                  <p className="text-sm font-medium">Mobile</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Android • Chrome • 2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 h-7 text-xs">Revoke</Button>
              </div>
              <Separator />
              <Button variant="destructive" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout from all devices
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
