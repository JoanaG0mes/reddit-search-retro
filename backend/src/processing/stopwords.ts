import type { Lang } from '../types.js'

/**
 * Etapa 3 do pré-processamento: remoção de stop words.
 * Listas compactas e explícitas (propositalmente visíveis no código,
 * já que o objetivo é demonstrar o conceito na disciplina).
 */
const STOPWORDS_EN = new Set([
  'a', 'about', 'after', 'again', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between',
  'both', 'but', 'by', 'can', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
  'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'whom', 'why', 'will', 'with', 'you', 'your', 'yours',
  'yourself', 'yourselves',
])

const STOPWORDS_PT = new Set([
  'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as',
  'ate', 'com', 'como', 'da', 'das', 'de', 'dela', 'delas', 'dele', 'deles',
  'depois', 'do', 'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em', 'entre',
  'era', 'essa', 'essas', 'esse', 'esses', 'esta', 'estas', 'este', 'estes',
  'eu', 'foi', 'for', 'foram', 'ha', 'isso', 'isto', 'ja', 'lhe', 'lhes',
  'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'muito',
  'na', 'nas', 'nao', 'nem', 'no', 'nos', 'nossa', 'nossas', 'nosso',
  'nossos', 'num', 'numa', 'o', 'os', 'ou', 'para', 'pela', 'pelas', 'pelo',
  'pelos', 'per', 'perante', 'por', 'qual', 'quando', 'que', 'quem', 'se',
  'sem', 'ser', 'seu', 'seus', 'so', 'sua', 'suas', 'tambem', 'te', 'tem',
  'ter', 'teu', 'teus', 'tu', 'tua', 'tuas', 'um', 'uma', 'voce', 'voces',
])

export function removeStopwords(tokens: string[], lang: Lang): string[] {
  const stopwords = lang === 'pt' ? STOPWORDS_PT : STOPWORDS_EN
  return tokens.filter((token) => !stopwords.has(token))
}
