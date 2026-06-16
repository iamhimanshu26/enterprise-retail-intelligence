import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { getGenerationHistory } from '@/lib/generatorHistory'
import type { GenerationHistoryEntry } from '@/types/generator'
import { GeneratorCard } from './GeneratorCard'

export function GenerationHistoryPanel() {
  const [history, setHistory] = useState<GenerationHistoryEntry[]>([])

  useEffect(() => {
    setHistory(getGenerationHistory())
  }, [])

  return (
    <GeneratorCard
      title="Generation History"
      description="Local history — future phases will persist to PostgreSQL"
      icon={<History className="h-5 w-5" />}
    >
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">No generation runs recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {history.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium">{entry.dataset_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{entry.record_count.toLocaleString()} records</span>
                <span>{entry.duration_seconds.toFixed(1)}s</span>
                {entry.export_format && <span>Exported: {entry.export_format}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </GeneratorCard>
  )
}
