'use client';

import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogOut, Users, UserCheck, Shield } from 'lucide-react';
import Logo from '@/components/logo';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  designation: string | null;
  status: { status: string } | null;
}

interface AdminDashboardViewProps {
  users: User[];
  totalEmployees: number;
  availableCount: number;
  adminName: string;
}

export function AdminDashboardView({ users, totalEmployees, availableCount, adminName }: AdminDashboardViewProps) {
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
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Employees</h2>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No employees registered yet</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user) => (
                <div key={user.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
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
                      user.status?.status === 'AVAILABLE'
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${user.status?.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {user.status?.status === 'AVAILABLE' ? 'Available' : 'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
