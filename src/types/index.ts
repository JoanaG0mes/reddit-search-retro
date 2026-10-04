export interface RedditResult {
  id: string
  title: string
  subreddit: string
  excerpt: string
  date: string
  comments: number
  score: number
  relevance: number
  url: string
  matchedTerms: string[]
}

export interface SearchStats {
  totalIndexed: number
  queryTimeMs: number
  resultsFound: number
}

export type SortOption = 'relevance' | 'date' | 'score' | 'comments'
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
export interface SearchApiResponse {
  query: string
  parsedQuery: string
  resultsFound: number
  queryTimeMs: number
  totalIndexed: number
  results: RedditResult[]
}
