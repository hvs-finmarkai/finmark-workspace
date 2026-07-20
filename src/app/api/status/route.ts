import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await prisma.status.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (!status) {
      return NextResponse.json({ error: "Status not found" }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, statusMessage, loginTime, logoutTime, lastSeen } = body;

    const updatedStatus = await prisma.status.upsert({
      where: { userId: session.user.id },
      update: {
        ...(status !== undefined && { status }),
        ...(statusMessage !== undefined && { statusMessage }),
        ...(loginTime !== undefined && { loginTime: new Date(loginTime) }),
        ...(logoutTime !== undefined && { logoutTime: new Date(logoutTime) }),
        ...(lastSeen !== undefined && { lastSeen: new Date(lastSeen) }),
      },
      create: {
        userId: session.user.id,
        status: status ?? "online",
        statusMessage: statusMessage ?? "",
        ...(loginTime && { loginTime: new Date(loginTime) }),
        ...(logoutTime && { logoutTime: new Date(logoutTime) }),
        ...(lastSeen && { lastSeen: new Date(lastSeen) }),
      },
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
