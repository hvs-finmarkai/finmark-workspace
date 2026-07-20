"use client";

import { useState } from "react";
import { Search, Plus, Edit2, UserX, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockEmployees = [
  { id: "1", name: "Arjun Mehta", email: "arjun@finmark.ai", department: "Engineering", role: "EMPLOYEE", designation: "Senior Engineer", status: "AVAILABLE", active: true },
  { id: "2", name: "Priya Sharma", email: "priya@finmark.ai", department: "Design", role: "EMPLOYEE", designation: "UI/UX Designer", status: "MEETING", active: true },
  { id: "3", name: "Rahul Verma", email: "rahul@finmark.ai", department: "Marketing", role: "MANAGER", designation: "Marketing Lead", status: "BUSY", active: true },
  { id: "4", name: "Sneha Patel", email: "sneha@finmark.ai", department: "HR", role: "HR", designation: "HR Manager", status: "AVAILABLE", active: true },
  { id: "5", name: "Vikram Singh", email: "vikram@finmark.ai", department: "Sales", role: "EMPLOYEE", designation: "Sales Executive", status: "AWAY", active: true },
  { id: "6", name: "Ananya Gupta", email: "ananya@finmark.ai", department: "Engineering", role: "EMPLOYEE", designation: "Full Stack Dev", status: "AVAILABLE", active: true },
  { id: "7", name: "Karan Joshi", email: "karan@finmark.ai", department: "Finance", role: "EMPLOYEE", designation: "Finance Analyst", status: "OFFLINE", active: false },
  { id: "8", name: "Meera Reddy", email: "meera@finmark.ai", department: "Engineering", role: "MANAGER", designation: "Product Manager", status: "AVAILABLE", active: true },
  { id: "9", name: "Rohit Nair", email: "rohit@finmark.ai", department: "Marketing", role: "EMPLOYEE", designation: "Content Writer", status: "BUSY", active: true },
  { id: "10", name: "Deepa Krishnan", email: "deepa@finmark.ai", department: "Engineering", role: "EMPLOYEE", designation: "QA Engineer", status: "AVAILABLE", active: true },
  { id: "11", name: "Amit Bansal", email: "amit@finmark.ai", department: "Sales", role: "MANAGER", designation: "Sales Manager", status: "MEETING", active: true },
  { id: "12", name: "Kavya Iyer", email: "kavya@finmark.ai", department: "Design", role: "EMPLOYEE", designation: "Graphic Designer", status: "AVAILABLE", active: true },
];

const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "HR", "Finance"];
const roles = ["All", "SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE", "HR"];
const assignableRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE", "HR"];
const statusOptions = ["All", "Active", "Inactive"];
const PAGE_SIZE = 6;

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN": return "danger";
    case "ADMIN": return "default";
    case "MANAGER": return "info";
    case "HR": return "warning";
    default: return "secondary";
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "AVAILABLE": return "success";
    case "BUSY": return "danger";
    case "MEETING": return "info";
    case "AWAY": return "warning";
    default: return "secondary";
  }
};

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState(mockEmployees);
  const [editEmployee, setEditEmployee] = useState<typeof mockEmployees[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<typeof mockEmployees[0] | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newRole, setNewRole] = useState("EMPLOYEE");
  const [newDesignation, setNewDesignation] = useState("");

  const filtered = employees.filter((emp) => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || emp.department === deptFilter;
    const matchRole = roleFilter === "All" || emp.role === roleFilter;
    const matchStatus = statusFilter === "All" || (statusFilter === "Active" ? emp.active : !emp.active);
    return matchSearch && matchDept && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    if (!newName || !newEmail) return;
    const newEmp = {
      id: String(Date.now()),
      name: newName,
      email: newEmail.includes("@") ? newEmail : `${newEmail}@finmark.ai`,
      department: newDept,
      role: newRole,
      designation: newDesignation,
      status: "OFFLINE",
      active: true,
    };
    setEmployees([newEmp, ...employees]);
    setNewName("");
    setNewEmail("");
    setNewDept("Engineering");
    setNewRole("EMPLOYEE");
    setNewDesignation("");
  };

  const handleEdit = () => {
    if (!editEmployee) return;
    setEmployees(employees.map((e) => (e.id === editEmployee.id ? editEmployee : e)));
    setEditEmployee(null);
  };

  const handleDeactivate = (id: string) => {
    setEmployees(employees.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setEmployees(employees.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage your organization&apos;s workforce</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium gradient-primary text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] h-10 px-4 py-2 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Create a new employee account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center gap-2">
                  <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="john" />
                  <span className="text-sm text-[hsl(var(--muted-foreground))] whitespace-nowrap">@finmark.ai</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {departments.filter(d => d !== "All").map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {assignableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Designation</label>
                <Input value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} placeholder="Software Engineer" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Create Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input placeholder="Search employees..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))]">
          {departments.map((d) => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))]">
          {roles.map((r) => <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--foreground))]">
          {statusOptions.map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((emp) => (
                  <tr key={emp.id} className="border-b border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--accent))]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{emp.email}</td>
                    <td className="py-3 px-4">{emp.department}</td>
                    <td className="py-3 px-4">
                      <Badge variant={roleBadgeVariant(emp.role) as any}>{emp.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={emp.active ? "success" : "secondary"}>{emp.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditEmployee({ ...emp })}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeactivate(emp.id)}>
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => setDeleteTarget(emp)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {editEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditEmployee(null)} />
          <div className="relative z-50 w-full max-w-lg rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input value={editEmployee.name} onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={editEmployee.email} onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <select value={editEmployee.department} onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {departments.filter(d => d !== "All").map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select value={editEmployee.role} onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })} className="flex h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] px-3 py-2 text-sm text-[hsl(var(--foreground))]">
                  {assignableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Designation</label>
                <Input value={editEmployee.designation} onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditEmployee(null)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Delete Employee</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
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
