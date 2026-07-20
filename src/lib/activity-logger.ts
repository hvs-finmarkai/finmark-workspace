import prisma from "@/lib/prisma";

export async function logActivity(
  userId: string,
  action: string,
  details?: string
) {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      details,
    },
  });
}
