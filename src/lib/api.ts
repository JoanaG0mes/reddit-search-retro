import type { SearchApiResponse, FullDocument } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export class ApiUnavailableError extends Error {}

export async function searchApi(query: string): Promise<SearchApiResponse> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`)
  } catch {
    throw new ApiUnavailableError('Backend do RETRØVA não respondeu.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? `Erro na busca (HTTP ${response.status}).`)
  }

  return response.json()
}

export interface StatsApiResponse {
  corpusSize: number
  vocabularySize: number
  topTerms: { term: string; documentFreq: number }[]
}

export async function statsApi(): Promise<StatsApiResponse> {
  const response = await fetch(`${API_BASE}/api/stats`)
  if (!response.ok) throw new ApiUnavailableError('Não foi possível obter estatísticas do backend.')
  return response.json()
}

export async function documentApi(id: string): Promise<FullDocument> {
  const response = await fetch(`${API_BASE}/api/document/${id}`)
  if (!response.ok) throw new ApiUnavailableError('Documento não disponível (backend offline ou fora do corpus).')
  return response.json()
}
