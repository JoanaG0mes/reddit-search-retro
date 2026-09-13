import type { ReactNode } from 'react'

interface PixelFrameProps {
  children: ReactNode
  className?: string
  tone?: 'panel' | 'cream'
}

/**
 * Moldura com estética de janela de jogo 8-bit: borda grossa preta,
 * "cantos" quadrados destacados e sombra deslocada (pixel shadow).
 */
export default function PixelFrame({ children, className = '', tone = 'panel' }: PixelFrameProps) {
  const bg = tone === 'cream' ? 'bg-cream text-ink' : 'bg-panel text-cream'

  return (
    <div className={`relative border-4 border-ink shadow-pixel ${bg} ${className}`}>
      {/* cantos decorativos estilo HUD */}
      <span className="absolute -top-1 -left-1 h-3 w-3 border-2 border-ink bg-yellow" aria-hidden="true" />
      <span className="absolute -top-1 -right-1 h-3 w-3 border-2 border-ink bg-cyan" aria-hidden="true" />
      <span className="absolute -bottom-1 -left-1 h-3 w-3 border-2 border-ink bg-cyan" aria-hidden="true" />
      <span className="absolute -bottom-1 -right-1 h-3 w-3 border-2 border-ink bg-yellow" aria-hidden="true" />
      {children}
    </div>
  )
}
