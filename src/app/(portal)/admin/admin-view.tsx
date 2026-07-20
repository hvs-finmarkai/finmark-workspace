'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Users, UserCheck, Shield, X, Clock, Trash2, Download, LogIn, LogOut as LogOutIcon, RefreshCw, Phone, Mail, Briefcase, Building, Pencil, Save } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Logo from '@/components/logo';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  designation: string | null;
  phone: string | null;
  skills: string | null;
  image: string | null;
  status: { status: string; statusMessage: string | null } | null;
}

interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

interface AdminDashboardViewProps {
  users: User[];
  totalEmployees: number;
  availableCount: number;
  adminName: string;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Available', dotClass: 'bg-green-500', badgeClass: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' };
    case 'BUSY':
      return { label: 'Busy', dotClass: 'bg-red-500', badgeClass: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' };
    case 'MEETING':
      return { label: 'In Meeting', dotClass: 'bg-violet-500', badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' };
    default:
      return { label: 'Offline', dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400' };
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'ADMIN':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'MANAGER':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
    default:
      return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
  }
}

function getActionIcon(action: string) {
  switch (action) {
    case 'LOGIN':
      return <LogIn className="w-4 h-4 text-green-400" />;
    case 'LOGOUT':
      return <LogOutIcon className="w-4 h-4 text-red-400" />;
    case 'STATUS_CHANGE':
      return <RefreshCw className="w-4 h-4 text-blue-400" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case 'LOGIN':
      return 'border-green-500/30 bg-green-500/5';
    case 'LOGOUT':
      return 'border-red-500/30 bg-red-500/5';
    case 'STATUS_CHANGE':
      return 'border-blue-500/30 bg-blue-500/5';
    default:
      return 'border-gray-500/30 bg-gray-500/5';
  }
}

function exportUserCSV(user: User, logs: ActivityLogEntry[]) {
  const headers = ['Date', 'Time', 'Action', 'Details'];
  const rows = logs.map((log) => {
    const date = new Date(log.createdAt);
    return [
      format(date, 'yyyy-MM-dd'),
      format(date, 'HH:mm:ss'),
      log.action,
      (log.details || '').replace(/,/g, ';'),
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(user.name || user.email).replace(/\s+/g, '_')}_activity.csv`;
  link.click();
  URL.revokeObjectURL(url);
}



export function AdminDashboardView({ users, totalEmployees, availableCount, adminName }: AdminDashboardViewProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userLogs, setUserLogs] = useState<ActivityLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [userList, setUserList] = useState(users);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', designation: '', department: '', phone: '', skills: '', role: '' });
  const [saving, setSaving] = useState(false);

  const startEditing = (user: User) => {
    setEditForm({
      name: user.name || '',
      designation: user.designation || '',
      department: user.department || '',
      phone: user.phone || '',
      skills: user.skills || '',
      role: user.role,
    });
    setEditing(true);
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setUserList(userList.map(u => u.id === selectedUser.id ? { ...u, ...updated } : u));
        setSelectedUser({ ...selectedUser, ...updated });
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this employee?')) return;
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    if (res.ok) {
      setUserList(userList.filter(u => u.id !== userId));
    }
  };

  const viewUserHistory = async (user: User) => {
    setSelectedUser(user);
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/activity/user?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserLogs(data);
      }
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleQuickExport = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/activity/user?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        exportUserCSV(user, data);
      }
    } catch {
      // silently fail
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a1a]/80 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={true} />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Employee View
            </a>
            <span className="text-sm text-gray-700 dark:text-gray-300">{adminName}</span>
            <button
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); signOut({ callbackUrl: '/admin/login' }); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Manage employees and monitor availability</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Employees</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Available Now</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-500/10">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees - availableCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Offline</p>
              </div>
            </div>
          </motion.div>
        </div>


        {/* Employee Cards Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Employees</h2>
          </div>

          {userList.length === 0 ? (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              No employees registered yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {userList.map((user, index) => {
                const userStatus = user.status?.status || 'OFFLINE';
                const statusInfo = getStatusBadge(userStatus);
                const skillsArray = user.skills ? user.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    onClick={() => viewUserHistory(user)}
                    className="group bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl p-5 hover:border-purple-500/30 dark:hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                            {user.image ? (
                              <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {(user.name || user.email)[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0a0a1a] ${statusInfo.dotClass}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name || 'Unnamed'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.designation || 'No designation'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleQuickExport(user, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Export CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => deleteUser(user.id, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Department & Phone */}
                    <div className="flex items-center gap-3 mb-3">
                      {user.department && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{user.department}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Tags */}
                    {skillsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {skillsArray.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                            {skill}
                          </span>
                        ))}
                        {skillsArray.length > 4 && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400">
                            +{skillsArray.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status & Role Badges */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                        {statusInfo.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>



      </main>


      {/* User Timeline Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#0f0f2a] border-l border-gray-200 dark:border-white/10 w-full max-w-md h-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0f0f2a]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Profile</h3>
                <div className="flex items-center gap-2">
                  {!editing && (
                    <button onClick={() => startEditing(selectedUser)} className="p-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors" title="Edit user">
                      <Pencil className="w-4 h-4 text-purple-500" />
                    </button>
                  )}
                  <button onClick={() => { setSelectedUser(null); setEditing(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-65px)]">
                {/* User Profile Section */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                  {editing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Designation</label>
                        <input value={editForm.designation} onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Department</label>
                        <select value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                          <option value="">Select department</option>
                          {['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Design', 'Operations'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
                        <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Skills (comma separated)</label>
                        <input value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                          <option value="EMPLOYEE">Employee</option>
                          <option value="MANAGER">Manager</option>
                          <option value="HR">HR</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={saveUser} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50">
                          <Save className="w-3.5 h-3.5" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                          {selectedUser.image ? (
                            <img src={selectedUser.image} alt={selectedUser.name || ''} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                              {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{selectedUser.name || 'Unnamed'}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.designation || 'No designation'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const s = getStatusBadge(selectedUser.status?.status || 'OFFLINE');
                              return (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.badgeClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.dotClass}`} />
                                  {s.label}
                                </span>
                              );
                            })()}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRoleBadge(selectedUser.role)}`}>
                              {selectedUser.role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.email}</span>
                        </div>
                        {selectedUser.department && (
                          <div className="flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.department}</span>
                          </div>
                        )}
                        {selectedUser.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.phone}</span>
                          </div>
                        )}
                        {selectedUser.designation && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.designation}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {selectedUser.skills && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selectedUser.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill) => (
                            <span key={skill} className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Activity Timeline Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Activity Timeline</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userLogs.length} entries</p>
                  </div>
                  <button
                    onClick={() => exportUserCSV(selectedUser, userLogs)}
                    disabled={loadingLogs || userLogs.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>

                {/* Timeline Entries */}
                <div className="p-6">
                  {loadingLogs ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  ) : userLogs.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No activity recorded yet</p>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" />

                      <div className="space-y-3">
                        {userLogs.map((log, idx) => {
                          const logDate = new Date(log.createdAt);
                          return (
                            <motion.div
                              key={log.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className={`relative flex items-start gap-3 p-3 rounded-lg border ${getActionColor(log.action)} ml-2`}
                            >
                              <div className="relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full bg-white dark:bg-[#0f0f2a] border border-gray-200 dark:border-white/10 flex items-center justify-center -ml-[13px]">
                                {getActionIcon(log.action)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {log.action === 'LOGIN' ? 'Logged In' : log.action === 'LOGOUT' ? 'Logged Out' : 'Status Changed'}
                                  </p>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
                                    {formatDistanceToNow(logDate)} ago
                                  </span>
                                </div>
                                {log.details && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{log.details}</p>
                                )}
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                  {format(logDate, 'dd MMM yyyy, hh:mm:ss a')}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
