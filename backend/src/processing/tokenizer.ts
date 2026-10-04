export function tokenize(normalizedText: string): string[] {
  if (!normalizedText) return []
  return normalizedText.split(' ').filter((token) => token.length > 1)
}
