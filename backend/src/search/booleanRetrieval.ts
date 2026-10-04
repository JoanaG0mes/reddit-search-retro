import { getPostingsForTerm } from '../index/invertedIndex.js'
import { getAllDocumentIds } from '../corpus/corpusManager.js'
import type { ParsedQuery } from './queryParser.js'

export interface BooleanRetrievalResult {
  docIds: Set<number>
  matchedTermsByDoc: Map<number, Set<string>>
}
export function executeBooleanQuery(parsed: ParsedQuery): BooleanRetrievalResult {
  const matchedTermsByDoc = new Map<number, Set<string>>()

  if (parsed.clauses.length === 0) {
    return { docIds: new Set(), matchedTermsByDoc }
  }

  const registerMatches = (docIds: Iterable<number>, term: string) => {
    for (const id of docIds) {
      if (!matchedTermsByDoc.has(id)) matchedTermsByDoc.set(id, new Set())
      matchedTermsByDoc.get(id)!.add(term)
    }
  }

  let resultSet: Set<number> | null = null

  for (const clause of parsed.clauses) {
    const postings = getPostingsForTerm(clause.term)

    if (resultSet === null) {
      resultSet = clause.operator === 'NOT' ? difference(getAllDocumentIds(), postings) : postings
      if (clause.operator !== 'NOT') registerMatches(postings, clause.rawTerm)
      continue
    }

    switch (clause.operator) {
      case 'AND':
        resultSet = intersect(resultSet, postings)
        registerMatches(postings, clause.rawTerm)
        break
      case 'OR':
        resultSet = union(resultSet, postings)
        registerMatches(postings, clause.rawTerm)
        break
      case 'NOT':
        resultSet = difference(resultSet, postings)
        break
    }
  }

  const finalDocIds = resultSet ?? new Set<number>()
  for (const docId of matchedTermsByDoc.keys()) {
    if (!finalDocIds.has(docId)) matchedTermsByDoc.delete(docId)
  }

  return { docIds: finalDocIds, matchedTermsByDoc }
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  return new Set([...a].filter((x) => b.has(x)))
}

function union(a: Set<number>, b: Set<number>): Set<number> {
  return new Set([...a, ...b])
}

function difference(a: Set<number>, b: Set<number>): Set<number> {
  return new Set([...a].filter((x) => !b.has(x)))
}
