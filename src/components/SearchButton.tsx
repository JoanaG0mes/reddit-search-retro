import type { ButtonHTMLAttributes } from 'react'

interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

/**
 * Botão com aparência de botão de arcade: relevo, sombra deslocada
 * que "afunda" ao clicar, e cor de destaque vibrante.
 */
export default function SearchButton({ label = 'BUSCAR', className = '', ...props }: SearchButtonProps) {
  return (
    <button
      {...props}
      className={`group relative border-4 border-ink bg-pink px-6 py-3 font-pixel text-xs text-cream shadow-pixel
        transition-transform duration-75
        hover:brightness-110
        active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}`}
    >
      {label}
    </button>
  )
}
