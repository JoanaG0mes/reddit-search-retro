import { Router } from 'express'
import { fetchSubredditPosts } from '../reddit/redditClient.js'
import { ingestPosts, corpusSize } from '../corpus/corpusManager.js'
import { buildInvertedIndex, vocabularySize, topVocabulary } from '../index/invertedIndex.js'

export const ingestionRouter = Router()

/**
 * Dispara a coleta de um subreddit + reconstrução do índice invertido.
 * Uso pontual/administrativo (não é chamado pela UI de busca do usuário final).
 *
 * POST /api/ingest  { "subreddit": "learnpython", "limit": 100 }
 */
ingestionRouter.post('/ingest', async (req, res) => {
  try {
    const subreddit = String(req.body?.subreddit ?? '').trim()
    const limit = Math.min(500, Number(req.body?.limit ?? 100))

    if (!subreddit) {
      res.status(400).json({ error: 'Campo "subreddit" é obrigatório.' })
      return
    }

    const posts = await fetchSubredditPosts(subreddit, limit)
    const ingested = ingestPosts(posts)
    const indexResult = buildInvertedIndex()

    res.json({ subreddit, ingested, ...indexResult, totalCorpus: corpusSize() })
  } catch (error) {
    res.status(502).json({ error: (error as Error).message })
  }
})

/** Painel acadêmico (seção 13): estado atual do pipeline de RI. */
ingestionRouter.get('/stats', (_req, res) => {
  res.json({
    corpusSize: corpusSize(),
    vocabularySize: vocabularySize(),
    topTerms: topVocabulary(10),
  })
})
