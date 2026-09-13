import { preprocess } from '../processing/pipeline.js'
import { detectLang } from '../processing/detectLang.js'

export type BooleanOperator = 'AND' | 'OR' | 'NOT'

export interface QueryClause {
  operator: BooleanOperator // operador que precede este termo (o primeiro termo usa 'AND' por convenção)
  term: string // já processado (normalizado/stemizado) — pronto para consultar o índice
  rawTerm: string // termo original, para exibição/depuração
}

export interface ParsedQuery {
  clauses: QueryClause[]
  displayString: string // ex.: "python AND programming NOT java"
}

const OPERATORS = new Set(['AND', 'OR', 'NOT'])

/**
 * Seção 9 — Boolean Retrieval.
 * Interpreta uma consulta como "python AND programming NOT java" e
 * devolve uma lista de cláusulas (operador + termo), já processando
 * cada termo pelo mesmo pipeline usado na indexação (para que o termo
 * da busca "bata" com os termos guardados no índice invertido).
 *
 * Termos sem operador explícito entre eles são tratados como AND
 * implícito (comportamento comum em motores de busca booleanos).
 */
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
    const processedTerm = terms[0] // um token de query vira, no máximo, um termo processado
    if (!processedTerm) continue // token era só stopword/ruído — ignora

    clauses.push({ operator: pendingOperator, term: processedTerm, rawTerm: token })
    pendingOperator = 'AND' // reseta para o próximo termo, a menos que outro operador apareça
  }

  const displayString = clauses
    .map((c, i) => (i === 0 ? c.rawTerm : `${c.operator} ${c.rawTerm}`))
    .join(' ')

  return { clauses, displayString }
}
