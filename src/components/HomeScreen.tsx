import SearchBar from './SearchBar'
import SearchButton from './SearchButton'
import PixelFrame from './PixelFrame'
import logo from '../assets/retrova-logo.png'

interface HomeScreenProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
  corpusSize: number
}

export default function HomeScreen({ query, onQueryChange, onSubmit, corpusSize }: HomeScreenProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <PixelFrame className="w-full max-w-2xl p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="RETRØVA"
            className="w-full max-w-md animate-floatY drop-shadow-[4px_4px_0_#0d0221]"
          />

          <p className="mt-4 font-mono text-sm text-white sm:text-base">
            Reddit Information Retrieval System
          </p>

          <p className="mt-1 font-pixel text-[9px] tracking-widest text-pink sm:text-[10px]">
            EXPLORE • SEARCH • DISCOVER
          </p>

          <div className="mt-8 w-full">
            <SearchBar value={query} onChange={onQueryChange} onSubmit={onSubmit} autoFocus />
          </div>

          <div className="mt-5">
            <SearchButton onClick={onSubmit} disabled={query.trim().length === 0} />
          </div>

          <p className="mt-6 font-mono text-xs leading-relaxed text-cream/60">
            Digite uma consulta booleana (ex.: <span className="text-cyan-soft">python AND programming NOT java</span>) para pesquisar no índice invertido construído a partir do corpus do Reddit.
          </p>

          <p className="mt-3 font-mono text-[11px] text-cream/40">
            Corpus indexado: <span className="text-yellow">{corpusSize.toLocaleString('pt-BR')}</span> documentos
          </p>
        </div>
      </PixelFrame>
    </div>
  )
}
