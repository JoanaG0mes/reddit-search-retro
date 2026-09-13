import '../db/schema.js'
import { fetchSubredditPosts } from '../reddit/redditClient.js'
import { ingestPosts, corpusSize } from '../corpus/corpusManager.js'
import { buildInvertedIndex, vocabularySize } from '../index/invertedIndex.js'

/**
 * Popula o corpus inicial (seção 4: 100 a 500 publicações).
 * Uso: npm run ingest
 * Ajuste a lista de subreddits/limite conforme o escopo da apresentação.
 */
const SUBREDDITS: { name: string; limit: number }[] = [
  { name: 'learnpython', limit: 60 },
  { name: 'learnprogramming', limit: 60 },
  { name: 'datascience', limit: 60 },
  { name: 'brdev', limit: 60 },
]

async function main() {
  for (const { name, limit } of SUBREDDITS) {
    console.log(`Coletando r/${name} (limite ${limit})...`)
    const posts = await fetchSubredditPosts(name, limit)
    const ingested = ingestPosts(posts)
    console.log(`  -> ${ingested} posts coletados/atualizados.`)
  }

  console.log('Reconstruindo índice invertido...')
  const result = buildInvertedIndex()

  console.log('--- Corpus pronto ---')
  console.log(`Documentos no corpus: ${corpusSize()}`)
  console.log(`Termos no vocabulário: ${vocabularySize()}`)
  console.log(`Documentos processados nesta execução: ${result.documentsProcessed}`)
}

main().catch((error) => {
  console.error('Falha na ingestão:', error)
  process.exit(1)
})
