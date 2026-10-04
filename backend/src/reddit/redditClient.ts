import { env } from '../config/env.js'
import type { RedditPostRaw } from '../types.js'

interface RedditAccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

interface RedditListingChild {
  data: {
    id: string
    title: string
    selftext: string
    subreddit: string
    created_utc: number
    score: number
    num_comments: number
    permalink: string
    is_self: boolean
  }
}

interface RedditListingResponse {
  data: {
    children: RedditListingChild[]
    after: string | null
  }
}

let cachedToken: { value: string; expiresAt: number } | null = null

function decodeHtml(html: string): string {
  let decoded = html
  for (let i = 0; i < 2; i++) {
    decoded = decoded
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#32;/g, ' ')
  }
  return decoded
}

function cleanContent(htmlContent: string): string {
  const decoded = decodeHtml(htmlContent)
  const mdMatch = decoded.match(/<div class="md">([\s\S]*?)<\/div>/i)
  const rawText = mdMatch ? mdMatch[1] : decoded
  return rawText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchWithRetry(url: string, userAgent: string): Promise<string | null> {
  const headers = {
    'User-Agent': userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) })
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
      if (!response.ok) return null
      return await response.text()
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return null
}

async function scrapeSubreddit(subreddit: string, limit: number): Promise<RedditPostRaw[]> {
  const ua = env.reddit.userAgent
  const urls = [
    `https://www.reddit.com/r/${subreddit}/.rss`,
    `https://www.reddit.com/r/${subreddit}/new/.rss`
  ]

  const posts: RedditPostRaw[] = []
  const seenIds = new Set<string>()

  for (const url of urls) {
    if (posts.length >= limit) break
    const xml = await fetchWithRetry(url, ua)
    if (!xml) continue

    const entries = xml.split('<entry>').slice(1)

    for (const entry of entries) {
      if (posts.length >= limit) break

      const idMatch = entry.match(/<id>(.*?)<\/id>/i)
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/i)
      const linkMatch = entry.match(/<link href="([^"]+)"/i)
      const pubMatch = entry.match(/<published>([\s\S]*?)<\/published>/i)
      const contentMatch = entry.match(/<content[^>]*>([\s\S]*?)<\/content>/i)

      if (!idMatch || !titleMatch) continue

      const redditId = idMatch[1].trim().replace(/^t3_/, '')
      if (seenIds.has(redditId)) continue
      seenIds.add(redditId)

      const title = decodeHtml(titleMatch[1].trim())
      const link = linkMatch ? linkMatch[1] : `https://reddit.com/r/${subreddit}/comments/${redditId}`
      const createdUtc = pubMatch ? Math.floor(new Date(pubMatch[1]).getTime() / 1000) : Math.floor(Date.now() / 1000)
      const selftext = contentMatch ? cleanContent(contentMatch[1]) : ''

      posts.push({
        redditId,
        title,
        selftext,
        subreddit,
        createdUtc,
        score: 1,
        numComments: 0,
        permalink: link,
      })
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  if (posts.length === 0) {
    throw new Error(`Nenhum post real coletado de r/${subreddit} via RSS. A fonte pode estar vazia, indisponivel ou bloquear o acesso. Dados de demonstracao nao foram usados.`)
  }

  return posts.slice(0, limit)
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value
  }

  if (!env.reddit.clientId || !env.reddit.clientSecret) {
    throw new Error('REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET não configurados.')
  }

  const basicAuth = Buffer.from(`${env.reddit.clientId}:${env.reddit.clientSecret}`).toString('base64')

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': env.reddit.userAgent,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao autenticar no Reddit (HTTP ${response.status})`)
  }

  const token = (await response.json()) as RedditAccessToken
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in - 60) * 1000,
  }
  return cachedToken.value
}

export async function fetchSubredditPosts(
  subreddit: string,
  limit: number,
  sort: 'new' | 'hot' | 'top' = 'new',
): Promise<RedditPostRaw[]> {
  if (!/^[A-Za-z0-9_]{2,21}$/.test(subreddit)) {
    throw new Error('Nome de subreddit invalido.')
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
    throw new Error('O limite deve ser um inteiro entre 1 e 500.')
  }
  if (!env.reddit.clientId || !env.reddit.clientSecret) {
    return scrapeSubreddit(subreddit, limit)
  }

  try {
    const accessToken = await getAccessToken()
    const posts: RedditPostRaw[] = []
    let after: string | null = null

    while (posts.length < limit) {
      const params = new URLSearchParams({
        limit: String(Math.min(100, limit - posts.length)),
        ...(after ? { after } : {}),
      })

      const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/${sort}?${params}`, {
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': env.reddit.userAgent,
        },
      })

      if (!response.ok) {
        throw new Error(`Falha na API do Reddit (HTTP ${response.status}).`)
      }

      const listing = (await response.json()) as RedditListingResponse

      for (const child of listing.data.children) {
        if (!child.data.is_self) continue
        posts.push({
          redditId: child.data.id,
          title: child.data.title,
          selftext: child.data.selftext,
          subreddit: child.data.subreddit,
          createdUtc: child.data.created_utc,
          score: child.data.score,
          numComments: child.data.num_comments,
          permalink: `https://reddit.com${child.data.permalink}`,
        })
      }

      after = listing.data.after
      if (!after || listing.data.children.length === 0) break
    }

    return posts.slice(0, limit)
  } catch (error) {
    console.warn('Coleta OAuth falhou; tentando RSS:', error instanceof Error ? error.message : 'erro desconhecido')
    return scrapeSubreddit(subreddit, limit)
  }
}
