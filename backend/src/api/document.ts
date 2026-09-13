import { Router } from 'express'
import { getDocumentById } from '../corpus/corpusManager.js'

export const documentRouter = Router()

/** GET /api/document/:id — devolve o documento completo do corpus (não truncado). */
documentRouter.get('/document/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'ID inválido.' })
    return
  }

  const doc = getDocumentById(id)
  if (!doc) {
    res.status(404).json({ error: 'Documento não encontrado no corpus.' })
    return
  }

  res.json({
    id: String(doc.id),
    title: doc.title,
    selftext: doc.selftext,
    subreddit: doc.subreddit,
    date: new Date(doc.createdUtc * 1000).toISOString().slice(0, 10),
    comments: doc.numComments,
    score: doc.score,
    url: doc.permalink,
    lang: doc.lang,
  })
})
