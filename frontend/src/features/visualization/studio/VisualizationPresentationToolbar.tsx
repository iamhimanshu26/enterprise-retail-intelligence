import { Download, Loader2, Maximize2, Monitor, Presentation, RefreshCw, Share2, Calendar } from 'lucide-react'
import { showDashboardPlaceholder } from '@/stores/toastStore'
import { cn } from '@/lib/cn'

interface VisualizationPresentationToolbarProps {
  onRefresh?: () => void
  refreshing?: boolean
  className?: string
}

export function VisualizationPresentationToolbar({
  onRefresh,
  refreshing,
  className,
}: VisualizationPresentationToolbarProps) {
  const actions = [
    {
      label: 'Export dashboard',
      icon: Download,
      detail: 'PDF and CSV export will be available in Phase 7 reporting.',
    },
    {
      label: 'Download report',
      icon: Download,
      detail: 'Scheduled report downloads arrive with enterprise reporting.',
    },
    {
      label: 'Presentation mode',
      icon: Presentation,
      detail: 'Fullscreen presentation layout — coming in Sprint 6.3+ polish.',
    },
    {
      label: 'Share view',
      icon: Share2,
      detail: 'Shareable dashboard links will connect to workspace permissions.',
    },
    {
      label: 'Schedule report',
      icon: Calendar,
      detail: 'Report scheduling integrates with Airflow in Phase 9.',
    },
    {
      label: 'Fullscreen',
      icon: Maximize2,
      detail: 'Immersive fullscreen studio view.',
    },
  ]

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onRefresh?.()}
        disabled={refreshing}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
      >
        {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Refresh
      </button>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => showDashboardPlaceholder(action.label, action.detail)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Presentation mode', 'Entering executive presentation layout…')}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Monitor className="h-4 w-4" />
        Present
      </button>
    </div>
  )
}
