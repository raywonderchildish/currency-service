import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding currency data...');

  const currencies = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
    },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
    console.log(`✅ Added currency: ${currency.code}`);
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
