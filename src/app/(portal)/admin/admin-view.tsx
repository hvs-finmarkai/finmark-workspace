'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogOut, Users, UserCheck, Shield, X, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Logo from '@/components/logo';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  designation: string | null;
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
  activityLogs: ActivityLogEntry[];
}

function getLogStatusColor(details: string | null) {
  if (!details) return 'bg-gray-400';
  if (details.includes('AVAILABLE')) return 'bg-green-500';
  if (details.includes('BUSY')) return 'bg-red-500';
  if (details.includes('MEETING')) return 'bg-violet-500';
  return 'bg-gray-400';
}

export function AdminDashboardView({ users, totalEmployees, availableCount, adminName, activityLogs }: AdminDashboardViewProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userLogs, setUserLogs] = useState<ActivityLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [userList, setUserList] = useState(users);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a]">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a1a]/80 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Manage employees and monitor availability</p>
        </motion.div>

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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Employees</h2>
          </div>

          {userList.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No employees registered yet</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {userList.map((user) => {
                const userStatus = user.status?.status || 'OFFLINE';
                return (
                  <div key={user.id} onClick={() => viewUserHistory(user)} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        userStatus === 'AVAILABLE'
                          ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                          : userStatus === 'BUSY'
                            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                            : userStatus === 'MEETING'
                              ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          userStatus === 'AVAILABLE' ? 'bg-green-500'
                            : userStatus === 'BUSY' ? 'bg-red-500'
                              : userStatus === 'MEETING' ? 'bg-violet-500'
                                : 'bg-gray-400'
                        }`} />
                        {userStatus === 'AVAILABLE' ? 'Available'
                          : userStatus === 'BUSY' ? 'Busy'
                            : userStatus === 'MEETING' ? 'In Meeting'
                              : 'Offline'}
                      </span>
                      <button
                        onClick={(e) => deleteUser(user.id, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Remove employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Log</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track when employees change their status</p>
          </div>

          {activityLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No activity yet</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {activityLogs.map((log) => (
                <div key={log.id} className="px-5 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {(log.user.name || log.user.email)[0].toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0a0a1a] ${getLogStatusColor(log.details)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {log.user.name || log.user.email} changed status
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {log.details}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {formatDistanceToNow(new Date(log.createdAt))} ago
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#161631] rounded-2xl border border-gray-200 dark:border-white/10 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedUser.name || selectedUser.email}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.email} • Activity History</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-5">
              {loadingLogs ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
              ) : userLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No activity recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {userLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                      <div className="mt-0.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.action === 'LOGIN' ? '🟢 Logged In' : log.action === 'LOGOUT' ? '🔴 Logged Out' : '🔄 Status Changed'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDistanceToNow(new Date(log.createdAt))} ago</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
