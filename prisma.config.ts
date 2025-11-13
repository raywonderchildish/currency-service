import { defineConfig } from 'prisma/config';

// Use process.env directly to avoid requiring DATABASE_URL for commands that don't need it
const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: databaseUrl,
  },
});
