import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');

  // Get current pathname from middleware header
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') || '';

  // Skip redirect check if already on the onboarding page
  if (!pathname.startsWith('/onboarding')) {
    // Check if user has completed onboarding (has designation set)
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      select: { designation: true },
    });

    // If no designation, redirect to onboarding
    if (!user?.designation) {
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
}
