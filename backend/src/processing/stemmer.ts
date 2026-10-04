import natural from 'natural'
import type { Lang } from '../types.js'

const { PorterStemmer, PorterStemmerPt } = natural
export function stem(token: string, lang: Lang): string {
  const stemmer = lang === 'pt' ? PorterStemmerPt : PorterStemmer
  return stemmer.stem(token)
}

export function stemTokens(tokens: string[], lang: Lang): string[] {
  return tokens.map((token) => stem(token, lang))
}
