import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AdminDashboardView } from './admin-view';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const users = await prisma.user.findMany({
    include: { status: true },
    orderBy: { createdAt: 'desc' },
  });

  const activityLogs = await prisma.activityLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  const totalEmployees = users.length;
  const availableCount = users.filter(u => u.status?.status === 'AVAILABLE').length;

  return (
    <AdminDashboardView
      users={JSON.parse(JSON.stringify(users))}
      totalEmployees={totalEmployees}
      availableCount={availableCount}
      adminName={session.user.name || 'Admin'}
      activityLogs={JSON.parse(JSON.stringify(activityLogs))}
    />
  );
}
