export type Lang = 'en' | 'pt'

export interface RedditPostRaw {
  redditId: string
  title: string
  selftext: string
  subreddit: string
  createdUtc: number
  score: number
  numComments: number
  permalink: string
}

export interface StoredDocument {
  id: number
  redditId: string
  title: string
  selftext: string
  subreddit: string
  createdUtc: number
  score: number
  numComments: number
  permalink: string
  lang: Lang
}

export interface SearchResultItem {
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

export interface SearchResponse {
  query: string
  parsedQuery: string
  resultsFound: number
  queryTimeMs: number
  totalIndexed: number
  results: SearchResultItem[]
}
