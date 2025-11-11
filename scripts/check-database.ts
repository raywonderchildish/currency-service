import { PrismaClient } from '@prisma/client';

async function checkDatabaseConnection(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Testing database connection...');

    await prisma.$connect();
    console.log('✅ Database connection successful');

    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database version:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
