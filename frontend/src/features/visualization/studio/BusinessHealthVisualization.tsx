import { MetricCard, SectionContainer } from '@/components/design-system'
import { VisualizationMetricCard } from '../dashboard/VisualizationMetricCard'
import { ComparisonChartCard } from '../containers/ComparisonChartCard'
import { EnterpriseBarChart } from '../charts'
import type { BusinessHealthSummary } from './executiveStudioAdapters'

interface BusinessHealthVisualizationProps {
  health: BusinessHealthSummary
}

export function BusinessHealthVisualization({ health }: BusinessHealthVisualizationProps) {
  return (
    <SectionContainer
      title="Business Health Visualization"
      description="Executive health score with strongest areas, risks, and opportunities."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label="Overall Health Score"
          value={`${health.overallScore.toFixed(0)} / 100`}
          className="lg:col-span-1"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
          <VisualizationMetricCard label="Strongest Area" value={health.strongestArea} />
          <VisualizationMetricCard label="Weakest Area" value={health.weakestArea} />
          <VisualizationMetricCard label="Highest Risk" value={health.highestRisk} />
          <VisualizationMetricCard label="Biggest Opportunity" value={health.biggestOpportunity} />
        </div>
      </div>

      <ComparisonChartCard title="Health Score Breakdown" data={health.breakdown}>
        <EnterpriseBarChart data={health.breakdown} valueFormat="percent" horizontal />
      </ComparisonChartCard>
    </SectionContainer>
  )
}
