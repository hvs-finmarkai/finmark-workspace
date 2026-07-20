import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { DashboardView } from './dashboard-view';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { status: true },
  });

  if (!currentUser) redirect('/login');

  // If user hasn't completed onboarding (no designation set), redirect to onboarding
  if (!currentUser.designation) {
    redirect('/onboarding');
  }

  const allUsers = await prisma.user.findMany({
    include: { status: true },
    orderBy: { name: 'asc' },
  });

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  return (
    <DashboardView
      currentUser={JSON.parse(JSON.stringify(currentUser))}
      allUsers={JSON.parse(JSON.stringify(allUsers))}
      isAdmin={isAdmin}
      hasPassword={currentUser?.passwordEnabled || false}
    />
  );
}
