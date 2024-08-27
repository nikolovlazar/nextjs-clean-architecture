import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sessions, todos, users } from "./schema";

// Setup sqlite database connection
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:/sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client, { schema: { users, sessions, todos } });

// Setup lucia adapter
export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);
