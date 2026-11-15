/** Idempotent schema, applied on first connection and by `npm run db:migrate`. */
export const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS waitlist (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name        TEXT,
    role        TEXT NOT NULL DEFAULT 'other',
    organization TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    organization TEXT,
    role        TEXT,
    topic       TEXT NOT NULL DEFAULT 'general',
    message     TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS learners (
    id          TEXT PRIMARY KEY,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    last_seen   TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS lesson_progress (
    learner_id  TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    lesson_id   TEXT NOT NULL,
    stars       INTEGER NOT NULL DEFAULT 0,
    best_blocks INTEGER,
    completed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (learner_id, lesson_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id)`,
];
