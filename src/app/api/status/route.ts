import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, statusMessage } = body;

    const updated = await prisma.status.upsert({
      where: { userId: session.user.id },
      update: { status, statusMessage: statusMessage || null, lastSeen: new Date() },
      create: { userId: session.user.id, status, statusMessage: statusMessage || null, lastSeen: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'STATUS_CHANGE',
        details: `Status: ${status}${statusMessage ? ' - ' + statusMessage : ''}`,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await prisma.status.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
