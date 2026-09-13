import type { SortOption } from '../types'
import StatsPanel from './StatsPanel'

interface SidebarProps {
  subreddits: string[]
  activeSubreddit: string | null
  onSubredditChange: (subreddit: string | null) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  totalIndexed: number
  resultsFound: number
  queryTimeMs: number
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'date', label: 'Data' },
  { value: 'score', label: 'Score' },
  { value: 'comments', label: 'Comentários' },
]

export default function Sidebar({
  subreddits,
  activeSubreddit,
  onSubredditChange,
  sortBy,
  onSortChange,
  totalIndexed,
  resultsFound,
  queryTimeMs,
}: SidebarProps) {
  return (
    <aside className="space-y-5">
      <StatsPanel totalIndexed={totalIndexed} resultsFound={resultsFound} queryTimeMs={queryTimeMs} />

      <div className="border-4 border-ink bg-panel p-4 shadow-pixel">
        <p className="mb-3 font-pixel text-[10px] text-cyan">ORDENAR POR</p>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              aria-pressed={sortBy === opt.value}
              className={`border-2 border-ink px-3 py-2 text-left font-mono text-xs transition-colors
                ${
                  sortBy === opt.value
                    ? 'bg-yellow text-ink'
                    : 'bg-panel2 text-cream hover:bg-panel2/70'
                }`}
            >
              {sortBy === opt.value ? '▶ ' : ''}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-4 border-ink bg-panel p-4 shadow-pixel">
        <p className="mb-3 font-pixel text-[10px] text-cyan">SUBREDDIT</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onSubredditChange(null)}
            aria-pressed={activeSubreddit === null}
            className={`border-2 border-ink px-3 py-2 text-left font-mono text-xs transition-colors
              ${activeSubreddit === null ? 'bg-pink text-cream' : 'bg-panel2 text-cream hover:bg-panel2/70'}`}
          >
            Todos
          </button>
          {subreddits.map((sr) => (
            <button
              key={sr}
              onClick={() => onSubredditChange(sr)}
              aria-pressed={activeSubreddit === sr}
              className={`border-2 border-ink px-3 py-2 text-left font-mono text-xs transition-colors
                ${activeSubreddit === sr ? 'bg-pink text-cream' : 'bg-panel2 text-cream hover:bg-panel2/70'}`}
            >
              r/{sr}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
