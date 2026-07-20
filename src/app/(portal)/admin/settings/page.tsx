"use client";

import { useState } from "react";
import { Save, Shield, Globe, Lock, KeyRound, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const timezones = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const mockEmployeeSettings = [
  { id: "1", name: "Arjun Mehta", email: "arjun@finmark.ai", googleEnabled: true, passwordEnabled: true, lastLogin: "Google OAuth" },
  { id: "2", name: "Priya Sharma", email: "priya@finmark.ai", googleEnabled: true, passwordEnabled: false, lastLogin: "Google OAuth" },
  { id: "3", name: "Rahul Verma", email: "rahul@finmark.ai", googleEnabled: false, passwordEnabled: true, lastLogin: "Password" },
  { id: "4", name: "Sneha Patel", email: "sneha@finmark.ai", googleEnabled: true, passwordEnabled: true, lastLogin: "Google OAuth" },
  { id: "5", name: "Vikram Singh", email: "vikram@finmark.ai", googleEnabled: false, passwordEnabled: true, lastLogin: "Password" },
  { id: "6", name: "Ananya Gupta", email: "ananya@finmark.ai", googleEnabled: true, passwordEnabled: true, lastLogin: "Google OAuth" },
];

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState("Finmark Technologies");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [forceReset, setForceReset] = useState(false);
  const [disablePassword, setDisablePassword] = useState(false);
  const [employees, setEmployees] = useState(mockEmployeeSettings);
  const [saved, setSaved] = useState(false);

  const handleSaveGeneral = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleForceReset = () => {
    setForceReset(true);
    setTimeout(() => setForceReset(false), 2000);
  };

  const toggleGoogle = (id: string) => {
    setEmployees(employees.map((e) => (e.id === id ? { ...e, googleEnabled: !e.googleEnabled } : e)));
  };

  const togglePassword = (id: string) => {
    setEmployees(employees.map((e) => (e.id === id ? { ...e, passwordEnabled: !e.passwordEnabled } : e)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Configure workspace and security settings</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <Save className="h-4 w-4" />
          Settings saved successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Globe className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle>General Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <Button onClick={handleSaveGeneral}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Shield className="h-4 w-4 text-red-500" />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--secondary))]">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <div>
                  <p className="text-sm font-medium">Force Password Reset</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Require all users to reset passwords on next login</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={handleForceReset} disabled={forceReset}>
                {forceReset ? "Triggered" : "Trigger"}
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--secondary))]">
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <div>
                  <p className="text-sm font-medium">Disable Password Login</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Only allow Google OAuth login globally</p>
                </div>
              </div>
              <button
                onClick={() => setDisablePassword(!disablePassword)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${disablePassword ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${disablePassword ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Mail className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <CardTitle>Employee Login Methods</CardTitle>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Manage individual employee authentication methods</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Google OAuth</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Password</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--accent))]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{emp.email}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleGoogle(emp.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${emp.googleEnabled ? "bg-emerald-500" : "bg-[hsl(var(--border))]"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${emp.googleEnabled ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePassword(emp.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${emp.passwordEnabled ? "bg-emerald-500" : "bg-[hsl(var(--border))]"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${emp.passwordEnabled ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={emp.lastLogin === "Google OAuth" ? "info" : "secondary"}>{emp.lastLogin}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
