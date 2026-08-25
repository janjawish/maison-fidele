import { and, desc, eq, like, or } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from './db';
import { members, transactions } from './db/schema';

export function createMember(input: { firstName: string; lastName: string; email: string }) {
  const id = randomUUID();
  const memberNumber = `MF-${new Date().getFullYear()}-${randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`;
  db.insert(members).values({ ...input, id, memberNumber, points: 0, createdAt: new Date() }).run();
  return { id, memberNumber };
}

export function getMember(id: string) {
  return db.select().from(members).where(eq(members.id, id)).get();
}

export function getTransactions(memberId: string) {
  return db.select().from(transactions).where(eq(transactions.memberId, memberId)).orderBy(desc(transactions.createdAt)).all();
}

export function searchMembers(query: string) {
  if (!query.trim()) return db.select().from(members).orderBy(desc(members.createdAt)).limit(20).all();
  const term = `%${query.trim()}%`;
  return db.select().from(members).where(or(like(members.firstName, term), like(members.lastName, term), like(members.email, term), like(members.memberNumber, term))).limit(20).all();
}

export function changePoints(memberId: string, amount: number, note: string) {
  return db.transaction((tx) => {
    const member = tx.select().from(members).where(eq(members.id, memberId)).get();
    if (!member) throw new Error('Membre introuvable.');
    const balanceAfter = member.points + amount;
    if (balanceAfter < 0) throw new Error('Le solde ne peut pas devenir négatif.');
    tx.update(members).set({ points: balanceAfter }).where(and(eq(members.id, memberId), eq(members.points, member.points))).run();
    tx.insert(transactions).values({ id: randomUUID(), memberId, amount, balanceAfter, note, createdAt: new Date() }).run();
    return balanceAfter;
  });
}
