import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password_hash: text('password_hash').notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  todo: text('todo').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
