import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { env } from '../config/env.js'

mkdirSync(dirname(env.dbPath), { recursive: true })

export const db = new Database(env.dbPath)
db.pragma('journal_mode = WAL')

/**
 * Schema relacional que representa o pipeline de RI:
 *
 * documents  -> o corpus (um post do Reddit = um documento)
 * terms      -> o vocabulário (termo normalizado + document frequency)
 * postings   -> o índice invertido propriamente dito (term -> lista de doc_id)
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    reddit_id     TEXT UNIQUE NOT NULL,
    title         TEXT NOT NULL,
    selftext      TEXT NOT NULL DEFAULT '',
    subreddit     TEXT NOT NULL,
    created_utc   INTEGER NOT NULL,
    score         INTEGER NOT NULL DEFAULT 0,
    num_comments  INTEGER NOT NULL DEFAULT 0,
    permalink     TEXT NOT NULL,
    lang          TEXT NOT NULL DEFAULT 'en',
    processed_at  TEXT
  );

  CREATE TABLE IF NOT EXISTS terms (
    term           TEXT PRIMARY KEY,
    document_freq  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS postings (
    term    TEXT NOT NULL REFERENCES terms(term) ON DELETE CASCADE,
    doc_id  INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    PRIMARY KEY (term, doc_id)
  );

  CREATE INDEX IF NOT EXISTS idx_postings_term ON postings(term);
  CREATE INDEX IF NOT EXISTS idx_documents_subreddit ON documents(subreddit);
`)
