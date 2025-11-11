import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly when prisma.config.ts is used
// This is needed because Prisma skips automatic .env loading when config file is present
config({ path: resolve(__dirname, '.env') });

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
