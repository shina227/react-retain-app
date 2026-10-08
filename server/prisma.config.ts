import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// The CLI (migrate, seed, studio) uses the direct connection; the app uses the pooled one.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
