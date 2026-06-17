import { SectionContainer, StatusBadge } from '@/components/design-system'
import type { AnomalySummary } from './executiveStudioAdapters'

const SEVERITY_STATUS: Record<string, 'completed' | 'in-progress' | 'planned'> = {
  critical: 'planned',
  warning: 'in-progress',
  info: 'completed',
}

interface AnomalyVisualizationSectionProps {
  anomalies: AnomalySummary[]
}

export function AnomalyVisualizationSection({ anomalies }: AnomalyVisualizationSectionProps) {
  return (
    <SectionContainer
      title="Anomaly Visualization"
      description="Rule-based anomaly summaries from the executive intelligence engine — no ML."
    >
      {anomalies.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No anomalies detected in the current intelligence sample.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/80">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Expected</th>
                <th className="px-4 py-3">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id} className="bg-card hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium capitalize">{anomaly.category}</td>
                  <td className="px-4 py-3">{anomaly.metric}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={SEVERITY_STATUS[anomaly.severity] ?? 'in-progress'}
                      label={anomaly.severity}
                    />
                  </td>
                  <td className="px-4 py-3 tabular-nums">{anomaly.value}</td>
                  <td className="px-4 py-3 text-muted-foreground">{anomaly.expectedRange}</td>
                  <td className="px-4 py-3 text-muted-foreground">{anomaly.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionContainer>
  )
}
