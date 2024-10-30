import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'turso',
  dialect: 'sqlite',
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
