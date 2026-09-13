import { Router } from 'express'
import { parseQuery } from '../search/queryParser.js'
import { executeBooleanQuery } from '../search/booleanRetrieval.js'
import { getDocumentById, corpusSize } from '../corpus/corpusManager.js'
import type { SearchResponse, SearchResultItem } from '../types.js'

export const searchRouter = Router()

searchRouter.get('/search', (req, res) => {
  const start = performance.now()
  const query = String(req.query.q ?? '').trim()

  if (!query) {
    res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' })
    return
  }

  const parsed = parseQuery(query)
  const { docIds, matchedTermsByDoc } = executeBooleanQuery(parsed)

  const results: SearchResultItem[] = [...docIds]
    .map((docId) => {
      const doc = getDocumentById(docId)
      if (!doc) return null
      const matchedTerms = [...(matchedTermsByDoc.get(docId) ?? [])]
      const totalClauseTerms = parsed.clauses.filter((c) => c.operator !== 'NOT').length || 1
      const relevance = Math.round((matchedTerms.length / totalClauseTerms) * 100)

      const item: SearchResultItem = {
        id: String(doc.id),
        title: doc.title,
        subreddit: doc.subreddit,
        excerpt: doc.selftext.slice(0, 220),
        date: new Date(doc.createdUtc * 1000).toISOString().slice(0, 10),
        comments: doc.numComments,
        score: doc.score,
        relevance,
        url: doc.permalink,
        matchedTerms,
      }
      return item
    })
    .filter((item): item is SearchResultItem => item !== null)
    .sort((a, b) => b.relevance - a.relevance)

  const response: SearchResponse = {
    query,
    parsedQuery: parsed.displayString,
    resultsFound: results.length,
    queryTimeMs: Math.round(performance.now() - start),
    totalIndexed: corpusSize(),
    results,
  }

  res.json(response)
})
