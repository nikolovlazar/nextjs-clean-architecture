import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { sessions, todos, users } from "./schema";

// Setup sqlite database connection
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema: { users, sessions, todos } });

// Run migrations
void migrate(db, { migrationsFolder: "./drizzle/migrations" });

// Setup lucia adapter
export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);
