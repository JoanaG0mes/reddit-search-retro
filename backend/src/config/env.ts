import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}. Confira o .env (veja .env.example).`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  dbPath: process.env.DB_PATH ?? './data/retrova.db',
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID ?? '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET ?? '',
    userAgent: required('REDDIT_USER_AGENT', 'retrova:v1.0.0 (by /u/unknown)'),
  },
}
