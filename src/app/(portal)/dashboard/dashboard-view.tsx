'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogOut, RefreshCw, Settings } from 'lucide-react';
import Logo from '@/components/logo';

interface Status {
  id: string;
  userId: string;
  status: string;
  statusMessage: string | null;
  lastSeen: string | null;
  updatedAt: string;
}

interface UserWithStatus {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  department: string | null;
  designation: string | null;
  role: string;
  status: Status | null;
}

interface DashboardViewProps {
  currentUser: UserWithStatus;
  allUsers: UserWithStatus[];
  isAdmin?: boolean;
  hasPassword?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'BUSY', label: 'Busy' },
  { value: 'MEETING', label: 'In Meeting' },
  { value: 'OFFLINE', label: 'Offline' },
] as const;

function getStatusColor(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-500';
    case 'BUSY':
      return 'bg-red-500';
    case 'MEETING':
      return 'bg-violet-500';
    default:
      return 'bg-gray-400';
  }
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    case 'BUSY':
      return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    case 'MEETING':
      return 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400';
    default:
      return 'bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return 'Available';
    case 'BUSY':
      return 'Busy';
    case 'MEETING':
      return 'In Meeting';
    default:
      return 'Offline';
  }
}

export function DashboardView({ currentUser, allUsers: initialUsers, isAdmin, hasPassword }: DashboardViewProps) {
  const [myStatus, setMyStatus] = useState(currentUser?.status?.status || 'OFFLINE');
  const [statusMessage, setStatusMessage] = useState(currentUser?.status?.statusMessage || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordSet, setPasswordSet] = useState(hasPassword || false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState(initialUsers);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const updateStatus = async (newStatus: string, message?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusMessage: message ?? statusMessage }),
      });
      if (res.ok) {
        setMyStatus(newStatus);
        setTimeout(fetchUsers, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (status: string) => {
    if (status === myStatus) return;
    updateStatus(status);
  };

  const handleMessageSubmit = () => {
    updateStatus(myStatus, statusMessage);
  };

  const availableCount = allUsers.filter(u => u.status?.status === 'AVAILABLE').length;
  const busyCount = allUsers.filter(u => u.status?.status === 'BUSY').length;
  const meetingCount = allUsers.filter(u => u.status?.status === 'MEETING').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a]">
      <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#111127]/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <div className="flex items-center gap-4">
            {isAdmin && (
              <a href="/admin" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors">
                Admin Panel
              </a>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentUser?.name || currentUser?.email}
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); signOut({ callbackUrl: '/login' }); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#161631] rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Status</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusClick(opt.value)}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
                  myStatus === opt.value
                    ? opt.value === 'AVAILABLE'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                      : opt.value === 'BUSY'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : opt.value === 'MEETING'
                          ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                          : 'bg-gray-500 text-white shadow-lg shadow-gray-500/25'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMessageSubmit();
              }}
              placeholder="What are you working on?"
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0a0a1a] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={handleMessageSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              Set
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-[#161631] rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Availability
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {availableCount} available • {busyCount} busy • {meetingCount} in meeting • Updates live
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Live</span>
            </div>
          </div>

          {allUsers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4">No team members yet</p>
          ) : (
            <div className="space-y-2">
              {allUsers.map((user) => {
                const userStatus = user.status?.status || 'OFFLINE';
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a3a] transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#161631] ${getStatusColor(userStatus)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name || 'Unnamed'}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 text-xs text-purple-500">(You)</span>
                        )}
                      </p>
                      {user.status?.statusMessage ? (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate italic">
                          {user.status.statusMessage}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.designation || user.email}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeClasses(userStatus)}`}>
                      {getStatusLabel(userStatus)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#161631] rounded-2xl border border-gray-200 dark:border-white/10 w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <span className="text-gray-500 text-lg">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {passwordSet ? 'Change Password' : 'Set Password'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {passwordSet ? 'Update your login password.' : 'Create a password to login without Google.'}
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="New password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  <button
                    onClick={async () => {
                      setPasswordMsg('');
                      if (newPassword.length < 8) { setPasswordMsg('Min 8 characters'); return; }
                      if (newPassword !== confirmPassword) { setPasswordMsg('Passwords do not match'); return; }
                      const res = await fetch('/api/auth/password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: newPassword, confirmPassword }),
                      });
                      if (res.ok) { setPasswordSet(true); setPasswordMsg('Password saved!'); setNewPassword(''); setConfirmPassword(''); }
                      else { setPasswordMsg('Error setting password'); }
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {passwordSet ? 'Update Password' : 'Set Password'}
                  </button>
                  {passwordMsg && <p className={`text-xs ${passwordMsg.includes('saved') ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
