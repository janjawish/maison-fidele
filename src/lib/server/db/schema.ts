import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  memberNumber: text('member_number').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  points: integer('points').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  memberId: text('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  note: text('note').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export type Member = typeof members.$inferSelect;
