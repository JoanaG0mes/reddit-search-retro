import { useEffect, useState } from 'react'
import type { RedditResult, FullDocument } from '../types'
import { documentApi, ApiUnavailableError } from '../lib/api'
import PixelFrame from './PixelFrame'

interface DocumentViewProps {
  summary: RedditResult // usado como fallback imediato (e em modo demo, sem backend)
  onBack: () => void
}

export default function DocumentView({ summary, onBack }: DocumentViewProps) {
  const [doc, setDoc] = useState<FullDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    documentApi(summary.id)
      .then((full) => {
        if (!cancelled) setDoc(full)
      })
      .catch((error) => {
        if (cancelled) return
        setUsingFallback(true)
        if (!(error instanceof ApiUnavailableError)) console.error(error)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [summary.id])

  const title = doc?.title ?? summary.title
  const body = doc?.selftext ?? summary.excerpt
  const subreddit = doc?.subreddit ?? summary.subreddit
  const date = doc?.date ?? summary.date
  const comments = doc?.comments ?? summary.comments
  const score = doc?.score ?? summary.score
  const url = doc?.url ?? summary.url

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 border-2 border-ink bg-panel2 px-3 py-1.5 font-pixel text-[9px] text-cream shadow-pixelSm"
      >
        ◀ VOLTAR AOS RESULTADOS
      </button>

      <PixelFrame tone="cream" className="p-5 sm:p-8">
        <p className="font-pixel text-[9px] uppercase tracking-wide text-ink/50">Document View</p>
        <h1 className="mt-2 font-mono text-xl font-bold leading-snug text-ink sm:text-2xl">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="border-2 border-ink bg-panel2 px-2 py-0.5 text-cream">
            r/{subreddit.replace(/^r\//, '')}
          </span>
          <span className="text-ink/60">{new Date(date).toLocaleDateString('pt-BR')}</span>
          {usingFallback && !loading && (
            <span className="border-2 border-ink bg-yellow px-2 py-0.5 text-[10px] text-ink">
              exibindo apenas o trecho indexado (backend indisponível)
            </span>
          )}
        </div>

        <div className="mt-5 border-t-2 border-ink/20 pt-4">
          {loading ? (
            <p className="font-mono text-sm text-ink/60">Carregando documento completo...</p>
          ) : (
            <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-ink/85">{body}</p>
          )}
        </div>

        {summary.matchedTerms.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t-2 border-ink/20 pt-4">
            <span className="font-pixel text-[8px] uppercase text-ink/50">Termos encontrados:</span>
            {summary.matchedTerms.map((term) => (
              <span key={term} className="border-2 border-ink bg-cyan/40 px-1.5 py-0.5 font-mono text-[11px]">
                {term}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t-2 border-ink/20 pt-4">
          <div className="flex gap-4 font-mono text-xs text-ink/70">
            <span>💬 {comments} comentários</span>
            <span>★ {score} pontos</span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-ink bg-pink px-3 py-1.5 font-pixel text-[9px] text-cream shadow-pixelSm"
          >
            ABRIR NO REDDIT
          </a>
        </div>
      </PixelFrame>
    </div>
  )
}
