import type { KeyboardEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'ex.: como aprender python...',
  autoFocus,
}: SearchBarProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="flex items-center border-4 border-ink bg-cream shadow-pixel focus-within:shadow-glowCyan">
      <span className="pl-3 pr-1 font-pixel text-cyan-soft" aria-hidden="true" style={{ color: '#0d0221' }}>
        &gt;_
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Campo de pesquisa"
        className="w-full bg-transparent py-4 pr-3 font-mono text-base text-ink placeholder:text-ink/40 focus:outline-none sm:text-lg"
      />
    </div>
  )
}
