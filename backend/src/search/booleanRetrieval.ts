import { getPostingsForTerm } from '../index/invertedIndex.js'
import type { ParsedQuery } from './queryParser.js'

export interface BooleanRetrievalResult {
  docIds: Set<number>
  matchedTermsByDoc: Map<number, Set<string>> // doc_id -> termos (da query) que casaram nesse doc
}

/**
 * Executa uma query já parseada contra o índice invertido, aplicando
 * as operações de conjunto clássicas de Boolean Retrieval:
 *
 *   AND -> interseção   OR -> união   NOT -> diferença
 *
 * A avaliação é feita da esquerda para a direita, cláusula por cláusula,
 * que é a forma mais simples e didática de implementar Boolean Retrieval
 * sem uma árvore de precedência de operadores.
 */
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
      // Primeira cláusula: não há conjunto anterior para combinar.
      // Limitação conhecida: se a consulta começar com "NOT termo" (sem termo
      // positivo antes), não há um "universo" de documentos para calcular a
      // diferença — aqui tratamos como se fosse positivo. Isso é aceitável
      // para o escopo do projeto; um índice completo manteria um conjunto
      // universal (todos os doc_ids) para resolver esse caso corretamente.
      resultSet = postings
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

  // remove termos "fantasma" de docs que acabaram excluídos por um NOT posterior
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
