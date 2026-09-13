import { useMemo, useState } from 'react'
import type { RedditResult, SortOption } from '../types'
import SearchBar from './SearchBar'
import SearchButton from './SearchButton'
import ResultsList from './ResultsList'
import Sidebar from './Sidebar'
import AcademicPanel from './AcademicPanel'

interface ResultsScreenProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
  results: RedditResult[]
  totalIndexed: number
  queryTimeMs: number
  isDemoMode: boolean
  isSearching: boolean
  parsedQuery?: string
  onViewDetails: (result: RedditResult) => void
}

function sortResults(results: RedditResult[], sortBy: SortOption): RedditResult[] {
  const sorted = [...results]
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'score':
      return sorted.sort((a, b) => b.score - a.score)
    case 'comments':
      return sorted.sort((a, b) => b.comments - a.comments)
    case 'relevance':
    default:
      return sorted.sort((a, b) => b.relevance - a.relevance)
  }
}

export default function ResultsScreen({
  query,
  onQueryChange,
  onSubmit,
  results,
  totalIndexed,
  queryTimeMs,
  isDemoMode,
  isSearching,
  parsedQuery,
  onViewDetails,
}: ResultsScreenProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [activeSubreddit, setActiveSubreddit] = useState<string | null>(null)

  const subreddits = useMemo(
    () => Array.from(new Set(results.map((r) => r.subreddit))),
    [results],
  )

  const filteredResults = useMemo(() => {
    const filtered = activeSubreddit
      ? results.filter((r) => r.subreddit === activeSubreddit)
      : results
    return sortResults(filtered, sortBy)
  }, [results, activeSubreddit, sortBy])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* barra de busca compacta no topo dos resultados */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar value={query} onChange={onQueryChange} onSubmit={onSubmit} />
        </div>
        <SearchButton onClick={onSubmit} disabled={query.trim().length === 0} className="sm:w-auto" />
      </div>

      <p className="mb-2 font-mono text-sm text-cream/70">
        {isSearching ? (
          'Consultando o índice invertido...'
        ) : (
          <>
            Exibindo resultados para{' '}
            <span className="font-bold text-yellow">"{query}"</span>
          </>
        )}
      </p>

      {isDemoMode && !isSearching && (
        <p className="mb-6 inline-block border-2 border-ink bg-yellow px-3 py-1 font-pixel text-[9px] text-ink">
          MODO DEMONSTRAÇÃO — backend offline, exibindo dados de exemplo
        </p>
      )}
      {!isDemoMode && <div className="mb-6" />}

      <div className="mb-6">
        <AcademicPanel
          lastQuery={query}
          lastParsedQuery={parsedQuery}
          lastResultsFound={isSearching ? undefined : results.length}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Sidebar
          subreddits={subreddits}
          activeSubreddit={activeSubreddit}
          onSubredditChange={setActiveSubreddit}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalIndexed={totalIndexed}
          resultsFound={filteredResults.length}
          queryTimeMs={queryTimeMs}
        />

        <ResultsList results={filteredResults} query={query} onViewDetails={onViewDetails} />
      </div>
    </div>
  )
}
