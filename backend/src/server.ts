import express from 'express'
import cors from 'cors'
import './db/schema.js' // garante que as tabelas existem antes de tudo
import { env } from './config/env.js'
import { searchRouter } from './api/search.js'
import { ingestionRouter } from './api/ingestion.js'
import { documentRouter } from './api/document.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', searchRouter)
app.use('/api', ingestionRouter)
app.use('/api', documentRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(env.port, () => {
  console.log(`RETRØVA backend rodando em http://localhost:${env.port}`)
})
