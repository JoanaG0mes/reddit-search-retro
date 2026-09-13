import type { RedditResult } from '../types'

interface ResultCardProps {
  result: RedditResult
  index: number
  onViewDetails: (result: RedditResult) => void
}

function relevanceColor(relevance: number): string {
  if (relevance >= 80) return 'text-cyan'
  if (relevance >= 50) return 'text-yellow'
  return 'text-pink'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ResultCard({ result, index, onViewDetails }: ResultCardProps) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="border-4 border-ink bg-cream text-ink shadow-pixel transition-transform hover:-translate-y-1">
      {/* cabeçalho do card: numero do resultado + relevancia, como um HUD */}
      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-3 py-1.5 text-cream">
        <span className="font-pixel text-[10px] text-yellow">RESULTADO #{num}</span>
        <span className={`font-pixel text-[10px] ${relevanceColor(result.relevance)}`}>
          {result.relevance}%
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="font-pixel text-[9px] uppercase tracking-wide text-ink/50">Título</p>
          <h3 className="font-mono text-base font-bold leading-snug sm:text-lg">{result.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="border-2 border-ink bg-panel2 px-2 py-0.5 text-cream">
            r/{result.subreddit.replace(/^r\//, '')}
          </span>
          <span className="text-ink/60">{formatDate(result.date)}</span>
        </div>

        <div>
          <p className="font-pixel text-[9px] uppercase tracking-wide text-ink/50">Trecho</p>
          <p className="font-mono text-sm leading-relaxed text-ink/85">"{result.excerpt}"</p>
        </div>

        {result.matchedTerms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-pixel text-[8px] uppercase text-ink/50">Termos encontrados:</span>
            {result.matchedTerms.map((term) => (
              <span key={term} className="border-2 border-ink bg-cyan/40 px-1.5 py-0.5 font-mono text-[11px]">
                {term}
              </span>
            ))}
          </div>
        )}

        {/* barra de relevância estilo barra de vida/progresso */}
        <div>
          <div className="mb-1 flex justify-between font-mono text-[11px] text-ink/60">
            <span>relevância</span>
            <span>{result.relevance}/100</span>
          </div>
          <div className="h-3 w-full border-2 border-ink bg-white/60">
            <div
              className="h-full bg-gradient-to-r from-cyan to-pink"
              style={{ width: `${result.relevance}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-4 font-mono text-xs text-ink/70">
            <span title="Comentários">💬 {result.comments}</span>
            <span title="Score">★ {result.score}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(result)}
              className="border-2 border-ink bg-cyan px-3 py-1.5 font-pixel text-[9px] text-ink shadow-pixelSm
                transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              DETALHES
            </button>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-ink bg-yellow px-3 py-1.5 font-pixel text-[9px] text-ink shadow-pixelSm
                transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              VER PUBLICAÇÃO
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
