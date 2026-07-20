import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/auth-utils';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { password, confirmPassword } = body;

  if (!password || !confirmPassword) {
    return NextResponse.json(
      { error: 'Password and confirmation are required' },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: 'Passwords do not match' },
      { status: 400 }
    );
  }

  const validation = validatePassword(password);

  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Password does not meet requirements', details: validation.errors },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      passwordEnabled: true,
    },
  });

  return NextResponse.json({ success: true, message: 'Password updated successfully' });
}
