import { normalizeText } from './normalizer.js'
import { tokenize } from './tokenizer.js'
import { removeStopwords } from './stopwords.js'
import { stemTokens } from './stemmer.js'
import { detectLang } from './detectLang.js'
import type { Lang } from '../types.js'

export interface ProcessedText {
  lang: Lang
  terms: string[]
}
export function preprocess(rawText: string, langHint?: Lang): ProcessedText {
  const lang = langHint ?? detectLang(rawText)
  const normalized = normalizeText(rawText)
  const tokens = tokenize(normalized)
  const withoutStopwords = removeStopwords(tokens, lang)
  const terms = stemTokens(withoutStopwords, lang)
  return { lang, terms }
}
