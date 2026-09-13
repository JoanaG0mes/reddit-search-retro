import { normalizeText } from './normalizer.js'
import { tokenize } from './tokenizer.js'
import { removeStopwords } from './stopwords.js'
import { stemTokens } from './stemmer.js'
import { detectLang } from './detectLang.js'
import type { Lang } from '../types.js'

export interface ProcessedText {
  lang: Lang
  terms: string[] // termos finais, já normalizados/tokenizados/sem stopwords/stemizados
}

/**
 * Pipeline completo de pré-processamento (seção 6 do briefing):
 *
 *   texto original -> normalização -> tokenização -> stopwords -> stemming -> termos
 *
 * Cada etapa vive em seu próprio módulo para poder ser testada e
 * explicada isoladamente na apresentação da disciplina.
 */
export function preprocess(rawText: string, langHint?: Lang): ProcessedText {
  const lang = langHint ?? detectLang(rawText)
  const normalized = normalizeText(rawText)
  const tokens = tokenize(normalized)
  const withoutStopwords = removeStopwords(tokens, lang)
  const terms = stemTokens(withoutStopwords, lang)
  return { lang, terms }
}
