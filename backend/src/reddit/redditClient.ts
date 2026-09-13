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

/**
 * Fluxo OAuth2 "client_credentials" — apropriado para um app tipo "script"
 * que só lê dados públicos, sem agir em nome de um usuário Reddit.
 * As credenciais (client id/secret) NUNCA saem do backend.
 */
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value
  }

  if (!env.reddit.clientId || !env.reddit.clientSecret) {
    throw new Error(
      'REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET não configurados. Preencha o .env a partir do .env.example.',
    )
  }

  const basicAuth = Buffer.from(`${env.reddit.clientId}:${env.reddit.clientSecret}`).toString('base64')

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': env.reddit.userAgent,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao autenticar no Reddit (HTTP ${response.status}): ${await response.text()}`)
  }

  const token = (await response.json()) as RedditAccessToken
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in - 60) * 1000, // renova 1 min antes de expirar
  }
  return cachedToken.value
}

/**
 * Coleta posts de um subreddit via GET /r/{subreddit}/{sort}, respeitando
 * o formato de User-Agent exigido e o limite de 60 req/min do OAuth do Reddit.
 * https://www.reddit.com/dev/api/
 */
export async function fetchSubredditPosts(
  subreddit: string,
  limit: number,
  sort: 'new' | 'hot' | 'top' = 'new',
): Promise<RedditPostRaw[]> {
  const accessToken = await getAccessToken()
  const posts: RedditPostRaw[] = []
  let after: string | null = null

  while (posts.length < limit) {
    const params = new URLSearchParams({
      limit: String(Math.min(100, limit - posts.length)),
      ...(after ? { after } : {}),
    })

    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/${sort}?${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': env.reddit.userAgent,
      },
    })

    if (!response.ok) {
      throw new Error(`Falha ao buscar r/${subreddit} (HTTP ${response.status}): ${await response.text()}`)
    }

    const listing = (await response.json()) as RedditListingResponse

    for (const child of listing.data.children) {
      if (!child.data.is_self) continue // seção 4: focamos em posts de texto (title + selftext)
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
}
