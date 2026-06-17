import { DashboardSection, DashboardGrid, SummaryCard } from '@/components/analytics'
import { AlertCenter } from '@/components/analytics/bi'
import { TableSkeleton } from '@/components/design-system'
import { useExecutiveIntelligence } from '@/hooks/useExecutiveIntelligence'
import type { AlertSeverity, BusinessAlert } from '@/types/dashboard'
import { BenchmarkTable } from './BenchmarkTable'
import { BusinessHealthCenterCard } from './BusinessHealthCenterCard'
import { ExecutiveScorecardPanel } from './ExecutiveScorecardPanel'
import { IntelligenceKpiCard } from './IntelligenceKpiCard'
import { IntelligenceMethodologyPanel } from './IntelligenceMethodologyPanel'
import { RecommendationsPanel } from './RecommendationsPanel'

function mapAnomaliesToAlerts(anomalies: import('@/types/intelligence').AnomalyItem[]): BusinessAlert[] {
  const severityMap: Record<string, AlertSeverity> = {
    critical: 'critical',
    warning: 'warning',
    info: 'info',
  }
  return anomalies.map((a) => ({
    id: a.id,
    title: a.anomaly_type.replace(/_/g, ' '),
    message: a.explanation,
    severity: severityMap[a.severity] ?? 'warning',
    timestamp: new Date().toISOString(),
  }))
}

export function ExecutiveIntelligencePlatform() {
  const { data, isLoading, isError } = useExecutiveIntelligence()

  if (isLoading) {
    return <TableSkeleton rows={6} />
  }

  if (isError || !data) {
    return null
  }

  return (
    <div className="space-y-8">
      <DashboardSection
        title="Executive Summary"
        description="Deterministic business narrative from analytics — Sprint 5.3 intelligence engine."
      >
        <SummaryCard
          title="Executive Intelligence Summary"
          summary={data.executive_summary.summary}
          highlights={data.executive_summary.highlights}
          tags={data.executive_summary.tags}
          recommendation={data.executive_summary.recommendation ?? undefined}
        />
      </DashboardSection>

      <BusinessHealthCenterCard health={data.business_health} />

      <DashboardSection title="KPI Intelligence" description="Value, trend, status, benchmark, and health indicators.">
        <DashboardGrid columns={4}>
          {data.kpi_intelligence.map((item) => (
            <IntelligenceKpiCard key={item.id} item={item} />
          ))}
        </DashboardGrid>
      </DashboardSection>

      <BenchmarkTable benchmarks={data.benchmarks} />

      <ExecutiveScorecardPanel scorecard={data.scorecard} />

      <DashboardSection title="Anomaly Center" description="Statistical anomalies with explanations.">
        <AlertCenter alerts={mapAnomaliesToAlerts(data.anomalies)} />
      </DashboardSection>

      <RecommendationsPanel recommendations={data.recommendations} />

      <IntelligenceMethodologyPanel />
    </div>
  )
}
