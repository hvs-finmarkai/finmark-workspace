"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Users, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialDepartments = [
  { id: "1", name: "Engineering", memberCount: 14, manager: "Meera Reddy" },
  { id: "2", name: "Sales", memberCount: 8, manager: "Amit Bansal" },
  { id: "3", name: "HR", memberCount: 4, manager: "Sneha Patel" },
  { id: "4", name: "Finance", memberCount: 5, manager: "Karan Joshi" },
  { id: "5", name: "Marketing", memberCount: 6, manager: "Rahul Verma" },
  { id: "6", name: "Design", memberCount: 4, manager: "Priya Sharma" },
];

const managers = ["Meera Reddy", "Amit Bansal", "Sneha Patel", "Karan Joshi", "Rahul Verma", "Priya Sharma", "Arjun Mehta"];

const deptColors: Record<string, string> = {
  Engineering: "from-purple-500 to-indigo-600",
  Sales: "from-emerald-500 to-teal-600",
  HR: "from-amber-500 to-orange-600",
  Finance: "from-blue-500 to-cyan-600",
  Marketing: "from-pink-500 to-rose-600",
  Design: "from-violet-500 to-fuchsia-600",
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newName, setNewName] = useState("");
  const [newManager, setNewManager] = useState(managers[0]);
  const [editDept, setEditDept] = useState<typeof initialDepartments[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<typeof initialDepartments[0] | null>(null);

  const handleAdd = () => {
    if (!newName) return;
    setDepartments([...departments, {
      id: String(Date.now()),
      name: newName,
      memberCount: 0,
      manager: newManager,
    }]);
    setNewName("");
    setNewManager(managers[0]);
  };

  const handleEdit = () => {
    if (!editDept) return;
    setDepartments(departments.map((d) => (d.id === editDept.id ? editDept : d)));
    setEditDept(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDepartments(departments.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage organizational departments</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium gradient-primary text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] h-10 px-4 py-2 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>Create a new organizational department</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Department Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Operations" />
              </div>
              <div>
                <label className="text-sm font-medium">Assign Manager</label>
                <select value={newManager} onChange={(e) => setNewManager(e.target.value)} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {managers.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Create Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="overflow-hidden hover:border-[hsl(var(--ring))]/50 transition-all duration-200 hover:shadow-lg">
            <div className={`h-2 bg-gradient-to-r ${deptColors[dept.name] || "from-gray-500 to-gray-600"}`} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{dept.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Users className="h-4 w-4" />
                    <span>{dept.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    <UserCircle className="h-4 w-4" />
                    <span>{dept.manager}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditDept({ ...dept })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => setDeleteTarget(dept)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditDept(null)} />
          <div className="relative z-50 w-full max-w-lg rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Edit Department</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Department Name</label>
                <Input value={editDept.name} onChange={(e) => setEditDept({ ...editDept, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Manager</label>
                <select value={editDept.manager} onChange={(e) => setEditDept({ ...editDept, manager: e.target.value })} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {managers.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditDept(null)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Delete Department</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? All members will need to be reassigned.
            </p>
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
