import natural from 'natural'
import type { Lang } from '../types.js'

const { PorterStemmer, PorterStemmerPt } = natural

/**
 * Etapa 4 do pré-processamento: stemming.
 * Reduz cada token à sua raiz (ex.: "learning" -> "learn",
 * "programando" -> "program"), para que variações morfológicas do
 * mesmo termo caiam na mesma entrada do índice invertido.
 */
export function stem(token: string, lang: Lang): string {
  const stemmer = lang === 'pt' ? PorterStemmerPt : PorterStemmer
  return stemmer.stem(token)
}

export function stemTokens(tokens: string[], lang: Lang): string[] {
  return tokens.map((token) => stem(token, lang))
}
