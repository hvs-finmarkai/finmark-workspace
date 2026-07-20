import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'LOGOUT',
        details: 'Logged out',
      },
    });

    await prisma.status.upsert({
      where: { userId: session.user.id },
      update: { status: 'OFFLINE', lastSeen: new Date() },
      create: { userId: session.user.id, status: 'OFFLINE', lastSeen: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
