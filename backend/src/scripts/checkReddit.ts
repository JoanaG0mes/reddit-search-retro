import { env } from '../config/env.js'
import { fetchSubredditPosts } from '../reddit/redditClient.js'

const subreddit = process.argv[2] ?? 'learnpython'
console.log('Credenciais OAuth: ' + (env.reddit.clientId && env.reddit.clientSecret ? 'configuradas' : 'ausentes; teste via RSS'))
console.log('Testando coleta real de r/' + subreddit + '...')
try {
  const posts = await fetchSubredditPosts(subreddit, 3)
  if (posts.length === 0) throw new Error('A fonte nao retornou documentos.')
  console.log('SUCESSO: ' + posts.length + ' posts reais recebidos.')
  for (const post of posts) {
    console.log(JSON.stringify({ id: post.redditId, title: post.title, url: post.permalink, contentLength: post.selftext.length }))
  }
} catch (error) {
  console.error('FALHA:', error instanceof Error ? error.message : 'erro desconhecido')
  process.exitCode = 1
}
