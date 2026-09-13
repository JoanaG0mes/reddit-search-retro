import type { RedditResult } from '../types'
import ResultCard from './ResultCard'

interface ResultsListProps {
  results: RedditResult[]
  query: string
  onViewDetails: (result: RedditResult) => void
}

export default function ResultsList({ results, query, onViewDetails }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="border-4 border-ink bg-panel px-6 py-12 text-center shadow-pixel">
        <p className="font-pixel text-sm text-pink">NENHUM RESULTADO ENCONTRADO</p>
        <p className="mt-3 font-mono text-sm text-cream/70">
          Não encontramos publicações do Reddit para "{query}". Tente outros termos.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {results.map((result, index) => (
        <ResultCard key={result.id} result={result} index={index} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}
