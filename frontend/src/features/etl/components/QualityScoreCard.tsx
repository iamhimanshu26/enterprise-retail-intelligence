import { ShieldCheck } from 'lucide-react'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import { QUALITY_DIMENSIONS, type QualityScore } from '@/types/etl'

interface QualityScoreCardProps {
  score: QualityScore | null
}

export function QualityScoreCard({ score }: QualityScoreCardProps) {
  const dqi = score?.data_quality_index ?? 97.8

  return (
    <GeneratorCard
      title="Data Quality Index"
      description="Enterprise quality dimensions"
      icon={<ShieldCheck className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold tracking-tight text-primary">{dqi.toFixed(1)}%</p>
          <p className="mt-1 text-xs text-muted-foreground">Overall Data Quality</p>
        </div>
        <div className="space-y-2">
          {QUALITY_DIMENSIONS.map(({ key, label }) => {
            const value = score?.[key] ?? 97
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${Math.min(value, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium tabular-nums">{value.toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </GeneratorCard>
  )
}
