/**
 * Etapa 2 do pré-processamento: tokenização.
 * Recebe texto já normalizado e o divide em tokens (palavras).
 * Descarta tokens vazios e tokens de um único caractere (ruído comum).
 */
export function tokenize(normalizedText: string): string[] {
  if (!normalizedText) return []
  return normalizedText.split(' ').filter((token) => token.length > 1)
}
