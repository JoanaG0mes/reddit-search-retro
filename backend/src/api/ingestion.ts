import { Router } from 'express'
import { fetchSubredditPosts } from '../reddit/redditClient.js'
import { ingestPosts, corpusSize } from '../corpus/corpusManager.js'
import { buildInvertedIndex, vocabularySize, topVocabulary } from '../index/invertedIndex.js'

export const ingestionRouter = Router()
ingestionRouter.post('/ingest', async (req, res) => {
  try {
    const subreddit = String(req.body?.subreddit ?? '').trim()
    const limit = Number(req.body?.limit ?? 100)

    if (!/^[A-Za-z0-9_]{2,21}$/.test(subreddit)) {
      res.status(400).json({ error: 'Informe um nome de subreddit válido, sem o prefixo r/.' })
      return
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      res.status(400).json({ error: 'O limite deve ser um inteiro entre 1 e 500.' })
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
ingestionRouter.get('/stats', (_req, res) => {
  res.json({
    corpusSize: corpusSize(),
    vocabularySize: vocabularySize(),
    topTerms: topVocabulary(10),
  })
})
