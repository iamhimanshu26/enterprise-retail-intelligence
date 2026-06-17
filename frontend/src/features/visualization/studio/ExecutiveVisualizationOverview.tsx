import { Link } from 'react-router-dom'
import { BarChart3, Sparkles } from 'lucide-react'
import { InsightSummaryPanel } from '../dashboard/InsightSummaryPanel'

export function ExecutiveVisualizationOverview() {
  return (
    <div className="space-y-4">
      <InsightSummaryPanel
        summary="Premium BI-style executive visualization studio — explore KPI performance, target vs actual benchmarks, business health, anomalies, and a gallery of interactive dashboards."
        tags={['Executive', 'Visualization', 'Phase 6']}
      />
      <div className="flex flex-wrap gap-3">
        <Link
          to="/visualization"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <BarChart3 className="h-4 w-4" />
          Chart Framework Studio
        </Link>
        <Link
          to="/executive-intelligence"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" />
          Executive Intelligence Dashboard
        </Link>
      </div>
    </div>
  )
}
