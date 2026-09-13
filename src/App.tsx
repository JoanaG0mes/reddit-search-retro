import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './components/HomeScreen'
import ResultsScreen from './components/ResultsScreen'
import DocumentView from './components/DocumentView'
import { mockResults, totalIndexedDocuments } from './data/mockResults'
import { searchApi, statsApi, ApiUnavailableError } from './lib/api'
import type { RedditResult } from './types'

type View = 'home' | 'results' | 'document'

/**
 * Fallback local, usado apenas quando o backend do RETRØVA não está no ar
 * (ex.: demonstração offline). Faz busca textual ingênua nos dados
 * mockados — NÃO é o motor de busca real do projeto, que vive no
 * backend (índice invertido + busca booleana). Ver backend/src/search.
 */
function demoSearch(query: string): RedditResult[] {
  const terms = query
    .toLowerCase()
    .replace(/\b(and|or|not)\b/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (terms.length === 0) return []

  return mockResults
    .filter((result) => {
      const haystack = `${result.title} ${result.excerpt} ${result.subreddit}`.toLowerCase()
      return terms.some((term) => haystack.includes(term))
    })
    .map((result) => ({
      ...result,
      matchedTerms: terms.filter((term) =>
        `${result.title} ${result.excerpt}`.toLowerCase().includes(term),
      ),
    }))
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [query, setQuery] = useState('')
  const [parsedQuery, setParsedQuery] = useState<string | undefined>(undefined)
  const [results, setResults] = useState<RedditResult[]>([])
  const [selectedResult, setSelectedResult] = useState<RedditResult | null>(null)
  const [queryTimeMs, setQueryTimeMs] = useState(0)
  const [totalIndexed, setTotalIndexed] = useState(totalIndexedDocuments)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Ao carregar, tenta buscar o tamanho real do corpus no backend.
  // Se o backend não responder, mantém o número mockado e liga o modo demo.
  useEffect(() => {
    statsApi()
      .then((stats) => setTotalIndexed(stats.corpusSize))
      .catch(() => setIsDemoMode(true))
  }, [])

  const handleSearch = async () => {
    if (query.trim().length === 0) return
    setIsSearching(true)

    try {
      const response = await searchApi(query)
      setResults(response.results)
      setParsedQuery(response.parsedQuery)
      setQueryTimeMs(response.queryTimeMs)
      setTotalIndexed(response.totalIndexed)
      setIsDemoMode(false)
    } catch (error) {
      // backend fora do ar (ou ainda não implantado) — cai para o modo demo
      const start = performance.now()
      const found = demoSearch(query)
      setResults(found)
      setParsedQuery(undefined)
      setQueryTimeMs(Math.round(performance.now() - start) + 8)
      setIsDemoMode(true)
      if (!(error instanceof ApiUnavailableError)) {
        console.error('Erro na busca real, usando modo demo:', error)
      }
    } finally {
      setIsSearching(false)
      setView('results')
    }
  }

  const handleLogoClick = () => setView('home')

  const handleViewDetails = (result: RedditResult) => {
    setSelectedResult(result)
    setView('document')
  }

  const handleBackFromDocument = () => setView('results')

  return (
    <div className="relative min-h-screen bg-base bg-grid text-cream">
      <div className="crt-overlay" />
      <Header onLogoClick={handleLogoClick} />

      <main>
        {view === 'home' && (
          <HomeScreen
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
            corpusSize={totalIndexed}
          />
        )}

        {view === 'results' && (
          <ResultsScreen
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
            results={results}
            totalIndexed={totalIndexed}
            queryTimeMs={queryTimeMs}
            isDemoMode={isDemoMode}
            isSearching={isSearching}
            parsedQuery={parsedQuery}
            onViewDetails={handleViewDetails}
          />
        )}

        {view === 'document' && selectedResult && (
          <DocumentView summary={selectedResult} onBack={handleBackFromDocument} />
        )}
      </main>

      <Footer />
    </div>
  )
}
