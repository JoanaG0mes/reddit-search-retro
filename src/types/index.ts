export interface RedditResult {
  id: string
  title: string
  subreddit: string
  excerpt: string
  date: string
  comments: number
  score: number
  relevance: number // 0 a 100 — score de exibição; hoje decorativo, futuramente TF-IDF/BM25
  url: string
  matchedTerms: string[] // termos da query que casaram com este documento no índice invertido
}

export interface SearchStats {
  totalIndexed: number
  queryTimeMs: number
  resultsFound: number
}

export type SortOption = 'relevance' | 'date' | 'score' | 'comments'

// Documento completo (não truncado) — usado na tela de Document View.
export interface FullDocument {
  id: string
  title: string
  selftext: string
  subreddit: string
  date: string
  comments: number
  score: number
  url: string
  lang: 'en' | 'pt'
}

// Espelha o payload retornado pelo backend em /api/search — ver backend/src/api/search.ts
export interface SearchApiResponse {
  query: string
  parsedQuery: string // representação normalizada da consulta booleana interpretada
  resultsFound: number
  queryTimeMs: number
  totalIndexed: number
  results: RedditResult[]
}
