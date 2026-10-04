import '../db/schema.js'
import { fetchSubredditPosts } from '../reddit/redditClient.js'
import { ingestPosts, corpusSize } from '../corpus/corpusManager.js'
import { buildInvertedIndex, vocabularySize } from '../index/invertedIndex.js'

const SUBREDDITS: { name: string; limit: number }[] = [
  { name: 'learnpython', limit: 50 },
  { name: 'learnprogramming', limit: 50 },
  { name: 'datascience', limit: 50 },
  { name: 'brdev', limit: 50 },
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
