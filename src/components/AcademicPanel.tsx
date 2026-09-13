import { useEffect, useState } from 'react'
import { statsApi } from '../lib/api'

interface AcademicPanelProps {
  lastQuery?: string
  lastParsedQuery?: string
  lastResultsFound?: number
}

interface PanelData {
  corpusSize: number
  vocabularySize: number
  topTerms: { term: string; documentFreq: number }[]
}

/**
 * Seção 13 do briefing — painel visual que expõe o pipeline de RI
 * (CORPUS -> VOCABULARY -> INDEX -> QUERY -> RESULTS) para a
 * apresentação da disciplina. Busca os números reais em /api/stats;
 * some silenciosamente se o backend estiver fora do ar (não é crítico
 * para o uso normal da busca).
 */
export default function AcademicPanel({ lastQuery, lastParsedQuery, lastResultsFound }: AcademicPanelProps) {
  const [data, setData] = useState<PanelData | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    statsApi()
      .then(setData)
      .catch(() => setUnavailable(true))
  }, [])

  if (unavailable) return null

  return (
    <div className="border-4 border-ink bg-panel p-4 shadow-pixel">
      <p className="mb-3 font-pixel text-[10px] text-cyan">PIPELINE DE RECUPERAÇÃO DE INFORMAÇÃO</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PipelineStep label="CORPUS" value={data ? `${data.corpusSize} docs` : '...'} />
        <PipelineStep label="VOCABULARY" value={data ? `${data.vocabularySize} termos` : '...'} />
        <PipelineStep label="QUERY" value={lastParsedQuery ?? lastQuery ?? '—'} truncate />
        <PipelineStep label="RESULTS" value={lastResultsFound !== undefined ? `${lastResultsFound} docs` : '—'} />
      </div>

      {data && data.topTerms.length > 0 && (
        <div className="mt-4 border-t-2 border-ink/20 pt-3">
          <p className="mb-2 font-mono text-[11px] text-cream/60">
            termos mais frequentes no vocabulário (document frequency):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.topTerms.map((t) => (
              <span
                key={t.term}
                className="border-2 border-ink bg-panel2 px-1.5 py-0.5 font-mono text-[11px] text-cream"
                title={`aparece em ${t.documentFreq} documentos`}
              >
                {t.term} <span className="text-cyan">({t.documentFreq})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PipelineStep({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="border-2 border-ink bg-ink px-2 py-2">
      <p className="font-pixel text-[8px] text-yellow">{label}</p>
      <p className={`mt-1 font-mono text-xs text-cream ${truncate ? 'truncate' : ''}`} title={value}>
        {value}
      </p>
    </div>
  )
}
