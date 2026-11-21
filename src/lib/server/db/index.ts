import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const configuredPath = env.DATABASE_URL || './data/loyalty.db';
const dbPath = resolve(configuredPath);
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    member_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    points INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS transactions_member_id_idx ON transactions(member_id);
`);

// Les colonnes created_at sont en mode Drizzle `timestamp` : des secondes Unix, pas des millisecondes.
// Répare les bases dont le jeu de démo a été inséré en millisecondes (dates affichées en l'an 58619).
// Toute valeur au-delà de 1e11 est forcément en millisecondes : la correction est idempotente.
sqlite.exec(`
  UPDATE members SET created_at = created_at / 1000 WHERE created_at > 100000000000;
  UPDATE transactions SET created_at = created_at / 1000 WHERE created_at > 100000000000;
`);

const demoExists = sqlite.prepare('SELECT id FROM members WHERE email = ?').get('camille@example.com');
if (!demoExists) {
  const id = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  sqlite.prepare(`INSERT INTO members (id, member_number, first_name, last_name, email, points, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, 'MF-DEMO-001', 'Camille', 'Martin', 'camille@example.com', 120, now);
  sqlite.prepare(`INSERT INTO transactions (id, member_id, amount, balance_after, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`).run(randomUUID(), id, 120, 120, 'Solde de bienvenue', now);
}

export const db = drizzle(sqlite, { schema });
export { sqlite };
