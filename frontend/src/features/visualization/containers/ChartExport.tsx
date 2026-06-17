import { showDashboardPlaceholder } from '@/stores/toastStore'

export function ChartExport() {
  return (
    <button
      type="button"
      onClick={() => showDashboardPlaceholder('Export', 'Chart export — PNG, SVG, CSV in Sprint 6.2')}
      className="text-xs font-medium text-primary hover:underline"
    >
      Export
    </button>
  )
}
