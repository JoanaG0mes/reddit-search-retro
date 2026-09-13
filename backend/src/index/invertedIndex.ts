import { db } from '../db/schema.js'
import { preprocess } from '../processing/pipeline.js'
import { getAllDocuments, markProcessed } from '../corpus/corpusManager.js'
import type { StoredDocument } from '../types.js'

const upsertTermStmt = db.prepare(`
  INSERT INTO terms (term, document_freq) VALUES (?, 1)
  ON CONFLICT(term) DO UPDATE SET document_freq = document_freq + 1
`)

const insertPostingStmt = db.prepare(`
  INSERT OR IGNORE INTO postings (term, doc_id) VALUES (?, ?)
`)

const clearDocPostingsStmt = db.prepare(`DELETE FROM postings WHERE doc_id = ?`)

/**
 * Processa um documento e grava suas entradas no índice invertido:
 * para cada termo único do documento, garante uma linha em `terms`
 * (vocabulário) e uma linha em `postings` (termo -> documento).
 *
 * Reprocessável: limpa os postings antigos do doc antes de reinserir,
 * então rodar de novo sobre o mesmo corpus não duplica nada.
 */
function indexDocument(doc: StoredDocument): void {
  clearDocPostingsStmt.run(doc.id)

  const { terms } = preprocess(`${doc.title} ${doc.selftext}`, doc.lang)
  const uniqueTerms = new Set(terms)

  for (const term of uniqueTerms) {
    upsertTermStmt.run(term)
    insertPostingStmt.run(term, doc.id)
  }

  markProcessed(doc.id)
}

/**
 * Reconstrói o índice invertido inteiro a partir do corpus atual.
 * Chamado depois de uma ingestão (seção 8: Índice Invertido).
 */
export function buildInvertedIndex(): { documentsProcessed: number; vocabularySize: number } {
  const documents = getAllDocuments()
  const indexAll = db.transaction((docs: StoredDocument[]) => {
    for (const doc of docs) indexDocument(doc)
  })
  indexAll(documents)

  const vocabularySize = (db.prepare('SELECT COUNT(*) as count FROM terms').get() as { count: number }).count
  return { documentsProcessed: documents.length, vocabularySize }
}

/** Retorna a postings list (IDs de documentos) de um termo já processado (stemizado). */
export function getPostingsForTerm(term: string): Set<number> {
  const rows = db.prepare('SELECT doc_id as docId FROM postings WHERE term = ?').all(term) as {
    docId: number
  }[]
  return new Set(rows.map((r) => r.docId))
}

export function vocabularySize(): number {
  return (db.prepare('SELECT COUNT(*) as count FROM terms').get() as { count: number }).count
}

export function topVocabulary(limit = 20): { term: string; documentFreq: number }[] {
  return db
    .prepare('SELECT term, document_freq as documentFreq FROM terms ORDER BY document_freq DESC LIMIT ?')
    .all(limit) as { term: string; documentFreq: number }[]
}
