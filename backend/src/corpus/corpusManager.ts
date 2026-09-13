import { db } from '../db/schema.js'
import { detectLang } from '../processing/detectLang.js'
import type { RedditPostRaw, StoredDocument } from '../types.js'

const insertStmt = db.prepare(`
  INSERT INTO documents (reddit_id, title, selftext, subreddit, created_utc, score, num_comments, permalink, lang)
  VALUES (@redditId, @title, @selftext, @subreddit, @createdUtc, @score, @numComments, @permalink, @lang)
  ON CONFLICT(reddit_id) DO UPDATE SET
    score = excluded.score,
    num_comments = excluded.num_comments
`)

/**
 * Insere (ou atualiza métricas de) um lote de posts coletados do Reddit.
 * Cada post vira um "documento" do corpus, com id sequencial próprio
 * (seção 5: "Document 001", "Document 002", ...).
 */
export function ingestPosts(posts: RedditPostRaw[]): number {
  const insertMany = db.transaction((items: RedditPostRaw[]) => {
    for (const post of items) {
      const lang = detectLang(`${post.title} ${post.selftext}`)
      insertStmt.run({ ...post, lang })
    }
  })
  insertMany(posts)
  return posts.length
}

export function getAllDocuments(): StoredDocument[] {
  const rows = db
    .prepare(
      `SELECT id, reddit_id as redditId, title, selftext, subreddit, created_utc as createdUtc,
              score, num_comments as numComments, permalink, lang
       FROM documents`,
    )
    .all() as StoredDocument[]
  return rows
}

export function getDocumentById(id: number): StoredDocument | undefined {
  return db
    .prepare(
      `SELECT id, reddit_id as redditId, title, selftext, subreddit, created_utc as createdUtc,
              score, num_comments as numComments, permalink, lang
       FROM documents WHERE id = ?`,
    )
    .get(id) as StoredDocument | undefined
}

export function markProcessed(docId: number): void {
  db.prepare(`UPDATE documents SET processed_at = datetime('now') WHERE id = ?`).run(docId)
}

export function corpusSize(): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM documents').get() as { count: number }
  return row.count
}
