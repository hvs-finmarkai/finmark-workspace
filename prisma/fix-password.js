const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test@1234', 10);
  console.log('Generated hash:', hash);

  const user = await prisma.user.update({
    where: { email: 'test@finmark.ai' },
    data: {
      passwordHash: hash,
      passwordEnabled: true,
    },
  });

  console.log('Updated user:', user.email, '| passwordEnabled:', user.passwordEnabled);

  // Verify
  const verify = await bcrypt.compare('Test@1234', hash);
  console.log('Verify compare:', verify);
}

main().catch(console.error).finally(() => prisma.$disconnect());
