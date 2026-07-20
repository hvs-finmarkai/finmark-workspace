const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Set a temporary designation so the redirect loop stops
  const user = await prisma.user.update({
    where: { email: 'harsh.singh@finmark.ai' },
    data: {
      name: 'Harsh Singh',
      designation: 'Founder & CEO',
      department: 'Engineering',
    },
  });
  console.log('Updated:', user.email, '| designation:', user.designation);
}

main().catch(console.error).finally(() => prisma.$disconnect());
