/**
 * Etapa 1 do pré-processamento: normalização.
 * Minúsculas + remoção de acentos + remoção de caracteres que não sejam
 * letras/números/espaço. Isso garante que "Python", "PYTHON" e "pýthon"
 * (hipoteticamente) caiam no mesmo token depois da tokenização.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos (á -> a, ç -> c, etc.)
    .replace(/[^a-z0-9\s]/g, ' ') // remove pontuação e símbolos
    .replace(/\s+/g, ' ')
    .trim()
}
