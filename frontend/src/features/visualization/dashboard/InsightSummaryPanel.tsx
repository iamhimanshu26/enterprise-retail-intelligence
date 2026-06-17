import { Sparkles } from 'lucide-react'
import { SummaryCard } from '@/components/analytics/SummaryCard'

interface InsightSummaryPanelProps {
  summary: string
  highlights?: string[]
  tags?: string[]
}

export function InsightSummaryPanel({ summary, highlights = [], tags = [] }: InsightSummaryPanelProps) {
  return (
    <SummaryCard
      title="Dashboard Insight"
      summary={summary}
      highlights={highlights}
      tags={tags}
      icon={Sparkles}
    />
  )
}
