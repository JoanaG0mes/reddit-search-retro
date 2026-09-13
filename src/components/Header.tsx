import logo from '../assets/retrova-logo.png'

interface HeaderProps {
  onLogoClick?: () => void
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="border-b-4 border-ink bg-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 focus-visible:outline-yellow"
          aria-label="Voltar para a tela inicial"
        >
          <img src={logo} alt="RETRØVA" className="h-6 w-auto sm:h-7" />
        </button>

        <span className="hidden font-mono text-xs text-cream/70 sm:block">
          Reddit Information Retrieval System
        </span>

        <span className="flex items-center gap-2 font-mono text-xs text-cyan">
          <span className="h-2 w-2 animate-blink bg-cyan" aria-hidden="true" />
          ONLINE
        </span>
      </div>
    </header>
  )
}
