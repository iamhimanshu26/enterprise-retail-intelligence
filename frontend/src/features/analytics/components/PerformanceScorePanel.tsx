import { MetricCard, SectionContainer } from '@/components/design-system'
import type { PerformanceScores } from '@/types/analytics'

export function PerformanceScorePanel({ scores }: { scores: PerformanceScores }) {
  return (
    <SectionContainer
      title="Performance Scores"
      description="Formula-based composite scores — no ML."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          label="Customer Segment Score"
          value={scores.customer_segment_score.toFixed(1)}
        />
        <MetricCard
          label="Inventory Risk Score"
          value={scores.inventory_risk_score.toFixed(1)}
        />
        <MetricCard label="Supplier Risk Score" value={scores.supplier_risk_score.toFixed(1)} />
        <MetricCard
          label="Top Store Score"
          value={
            Object.values(scores.store_scores)[0]?.toFixed(1) ??
            '—'
          }
        />
        <MetricCard
          label="Top Product Score"
          value={
            Object.values(scores.product_scores)[0]?.toFixed(1) ??
            '—'
          }
        />
      </div>
    </SectionContainer>
  )
}
