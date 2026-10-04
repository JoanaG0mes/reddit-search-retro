import type { Lang } from '../types.js'
const PT_MARKERS = [
  ' que ', ' não ', ' para ', ' com ', ' uma ', ' isso ', ' voc', ' então ',
  ' já ', ' está ', ' são ', ' também ',
]

export function detectLang(text: string): Lang {
  const padded = ` ${text.toLowerCase()} `
  const ptHits = PT_MARKERS.reduce((count, marker) => (padded.includes(marker) ? count + 1 : count), 0)
  return ptHits >= 2 ? 'pt' : 'en'
}
