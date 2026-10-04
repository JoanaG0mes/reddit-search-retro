import { preprocess } from '../processing/pipeline.js'
import { detectLang } from '../processing/detectLang.js'

export type BooleanOperator = 'AND' | 'OR' | 'NOT'

export interface QueryClause {
  operator: BooleanOperator
  term: string
  rawTerm: string
}

export interface ParsedQuery {
  clauses: QueryClause[]
  displayString: string
}

const OPERATORS = new Set(['AND', 'OR', 'NOT'])
export function parseQuery(rawQuery: string): ParsedQuery {
  const lang = detectLang(rawQuery)
  const rawTokens = rawQuery.trim().split(/\s+/).filter(Boolean)

  const clauses: QueryClause[] = []
  let pendingOperator: BooleanOperator = 'AND'

  for (const token of rawTokens) {
    const upper = token.toUpperCase()
    if (OPERATORS.has(upper)) {
      pendingOperator = upper as BooleanOperator
      continue
    }

    const { terms } = preprocess(token, lang)
    const processedTerm = terms[0]
    if (!processedTerm) continue

    clauses.push({ operator: pendingOperator, term: processedTerm, rawTerm: token })
    pendingOperator = 'AND'
  }

  const displayString = clauses
    .map((c, i) => (i === 0 && c.operator !== 'NOT' ? c.rawTerm : `${c.operator} ${c.rawTerm}`))
    .join(' ')

  return { clauses, displayString }
}
