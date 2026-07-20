import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If not logged in, redirect to login
  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has already completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { designation: true },
  });

  // If user already has designation set (onboarding complete), skip to dashboard
  if (user?.designation) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
