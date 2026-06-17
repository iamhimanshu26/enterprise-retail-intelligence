import { Download, Loader2, Maximize2, RefreshCw } from 'lucide-react'
import { showDashboardPlaceholder } from '@/stores/toastStore'
import { cn } from '@/lib/cn'

interface DashboardExportToolbarProps {
  onRefresh?: () => void
  refreshing?: boolean
  className?: string
}

export function DashboardExportToolbar({ onRefresh, refreshing, className }: DashboardExportToolbarProps) {
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
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Export dashboard', 'Dashboard export — PDF/CSV in Sprint 6.3')}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Fullscreen', 'Fullscreen dashboard view in Sprint 6.3')}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <Maximize2 className="h-4 w-4" />
        Fullscreen
      </button>
    </div>
  )
}
