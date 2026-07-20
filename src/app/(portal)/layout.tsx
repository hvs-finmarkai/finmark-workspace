import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  // Check if user has completed onboarding (has designation set)
  const user = await prisma.user.findUnique({
    where: { id: session.user?.id },
    select: { designation: true },
  });

  // If no designation, redirect to onboarding (which is outside this layout)
  if (!user?.designation) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
