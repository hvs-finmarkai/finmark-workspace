"use client";

import { useState } from "react";
import { Shield, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const permissions = [
  "View Dashboard",
  "Manage Employees",
  "Create Announcement",
  "View Reports",
  "Manage Roles",
  "Delete Users",
];

const initialRoles: Record<string, { label: string; variant: any; permissions: Record<string, boolean> }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    variant: "danger",
    permissions: {
      "View Dashboard": true,
      "Manage Employees": true,
      "Create Announcement": true,
      "View Reports": true,
      "Manage Roles": true,
      "Delete Users": true,
    },
  },
  ADMIN: {
    label: "Admin",
    variant: "default",
    permissions: {
      "View Dashboard": true,
      "Manage Employees": true,
      "Create Announcement": true,
      "View Reports": true,
      "Manage Roles": true,
      "Delete Users": false,
    },
  },
  MANAGER: {
    label: "Manager",
    variant: "info",
    permissions: {
      "View Dashboard": true,
      "Manage Employees": true,
      "Create Announcement": true,
      "View Reports": true,
      "Manage Roles": false,
      "Delete Users": false,
    },
  },
  EMPLOYEE: {
    label: "Employee",
    variant: "secondary",
    permissions: {
      "View Dashboard": true,
      "Manage Employees": false,
      "Create Announcement": false,
      "View Reports": false,
      "Manage Roles": false,
      "Delete Users": false,
    },
  },
  HR: {
    label: "HR",
    variant: "warning",
    permissions: {
      "View Dashboard": true,
      "Manage Employees": true,
      "Create Announcement": true,
      "View Reports": true,
      "Manage Roles": false,
      "Delete Users": false,
    },
  },
};

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const togglePermission = (roleKey: string, permission: string) => {
    setRoles({
      ...roles,
      [roleKey]: {
        ...roles[roleKey],
        permissions: {
          ...roles[roleKey].permissions,
          [permission]: !roles[roleKey].permissions[permission],
        },
      },
    });
  };

  const handleSave = (roleKey: string) => {
    setEditingRole(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Manage access control and role-based permissions</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <Shield className="h-4 w-4" />
          Permissions saved successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(roles).map(([key, role]) => (
          <Card key={key} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--secondary))]">
                    <Shield className="h-4 w-4 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{role.label}</CardTitle>
                    <Badge variant={role.variant} className="mt-1">{key}</Badge>
                  </div>
                </div>
                {editingRole === key ? (
                  <Button size="sm" onClick={() => handleSave(key)}>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setEditingRole(key)}>
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <label key={permission} className="flex items-center gap-3 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={role.permissions[permission]}
                      onChange={() => togglePermission(key, permission)}
                      disabled={editingRole !== key}
                      className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))] disabled:opacity-60"
                    />
                    <span className={`text-sm ${editingRole !== key ? "text-[hsl(var(--muted-foreground))]" : ""}`}>{permission}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
