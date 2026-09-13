interface StatsPanelProps {
  totalIndexed: number
  resultsFound: number
  queryTimeMs: number
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-ink/20 py-2 last:border-none">
      <span className="font-mono text-xs text-cream/70">{label}</span>
      <span className="font-pixel text-[10px] text-yellow">{value}</span>
    </div>
  )
}

export default function StatsPanel({ totalIndexed, resultsFound, queryTimeMs }: StatsPanelProps) {
  return (
    <div className="border-4 border-ink bg-panel p-4 shadow-pixel">
      <p className="mb-3 font-pixel text-[10px] text-cyan">STATUS DA BUSCA</p>

      <StatRow label="Documentos indexados" value={totalIndexed.toLocaleString('pt-BR')} />
      <StatRow label="Resultados encontrados" value={String(resultsFound)} />
      <StatRow label="Tempo de resposta" value={`${queryTimeMs} ms`} />

      {/* indicador de "LEVEL" — decorativo, sugere cobertura do índice */}
      <div className="mt-3">
        <div className="mb-1 flex justify-between font-mono text-[11px] text-cream/60">
          <span>cobertura do índice</span>
          <span>LV. 7</span>
        </div>
        <div className="h-3 w-full border-2 border-ink bg-ink/40">
          <div className="h-full w-[72%] bg-gradient-to-r from-cyan to-yellow" />
        </div>
      </div>
    </div>
  )
}
